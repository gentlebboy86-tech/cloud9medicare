const crypto = require('crypto');

const sentRequestIds = new Set();
const recentIps = new Map();

function digits(value) {
  return String(value || '').replace(/\D/g, '');
}

function clean(value, maxLength = 70) {
  return String(value || '-')
    .replace(/[\r\n]+/g, ' ')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength) || '-';
}

function trackingValue(memo, label) {
  const match = String(memo || '').match(new RegExp(`\\[${label}:\\s*([^\\]]+)\\]`));
  return clean(match?.[1] || '-', 50);
}

function getNotificationContact(request) {
  return {
    requesterName: clean(
      request.requester_name || trackingValue(request.memo, '신청자이름'),
      40,
    ),
    contactPhone: digits(
      request.contact_phone || trackingValue(request.memo, '신청자연락처'),
    ),
  };
}

function buildNotificationText(request) {
  const area = trackingValue(request.memo, '신청지역');
  const source = trackingValue(request.memo, '유입경로');
  const {requesterName, contactPhone} = getNotificationContact(request);
  if (requesterName === '-' || !/^0\d{9,10}$/.test(contactPhone)) return null;

  return [
    '[클라우드나인] 새 병원동행 신청',
    `이름: ${requesterName}`,
    `연락처: ${contactPhone}`,
    `지역: ${area}`,
    `병원: ${clean(request.hospital)}`,
    `일시: ${clean(request.care_date)} ${clean(request.care_time)}`,
    `유입: ${source}`,
    '확인: https://cloud9medicare.vercel.app/admin',
  ].join('\n');
}

function solapiAuthorization(apiKey, apiSecret) {
  const date = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString('hex');
  const signature = crypto.createHmac('sha256', apiSecret).update(date + salt).digest('hex');
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

async function sendSms(text) {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const from = digits(process.env.SOLAPI_SENDER_NUMBER);
  const to = digits(process.env.ADMIN_ALERT_PHONE);
  if (!apiKey || !apiSecret || !from || !to) throw new Error('SMS_ENV_MISSING');

  const response = await fetch('https://api.solapi.com/messages/v4/send-many/detail', {
    method: 'POST',
    headers: {
      Authorization: solapiAuthorization(apiKey, apiSecret),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({messages: [{to, from, text, autoTypeDetect: true}]}),
  });
  const result = await response.json();
  if (!response.ok || result.failedMessageList?.length) {
    throw new Error(result.failedMessageList?.[0]?.statusMessage || result.errorMessage || 'SMS_SEND_FAILED');
  }
  return result;
}

async function getCareRequest(requestId) {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) throw new Error('SUPABASE_ENV_MISSING');
  const query = new URLSearchParams({
    id: `eq.${requestId}`,
    select: 'id,requester_name,contact_phone,hospital,care_date,care_time,memo,created_at',
  });
  const response = await fetch(`${supabaseUrl}/rest/v1/care_requests?${query}`, {
    headers: {apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`},
  });
  if (!response.ok) throw new Error('REQUEST_LOOKUP_FAILED');
  const [request] = await response.json();
  return request || null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ok: false});

  try {
    const requestId = String(req.body?.requestId || '');
    if (!/^[0-9a-f-]{36}$/i.test(requestId)) return res.status(400).json({ok: false});
    if (sentRequestIds.has(requestId)) return res.status(200).json({ok: true, duplicate: true});

    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0];
    const lastRequestAt = recentIps.get(ip) || 0;
    if (Date.now() - lastRequestAt < 10000) return res.status(429).json({ok: false});

    const request = await getCareRequest(requestId);
    if (!request) return res.status(404).json({ok: false});
    const age = Date.now() - new Date(request.created_at).getTime();
    if (!Number.isFinite(age) || age < -60000 || age > 5 * 60 * 1000) {
      return res.status(409).json({ok: false});
    }

    recentIps.set(ip, Date.now());
    const text = buildNotificationText(request);
    if (!text) {
      return res.status(422).json({ok: false, code: 'CONTACT_INFO_MISSING'});
    }

    await sendSms(text);
    sentRequestIds.add(requestId);
    if (sentRequestIds.size > 500) sentRequestIds.delete(sentRequestIds.values().next().value);
    return res.status(200).json({ok: true});
  } catch (error) {
    console.error('care-request SMS failed:', error.message);
    return res.status(500).json({ok: false, code: error.message});
  }
};

module.exports._test = {buildNotificationText, clean, digits, getNotificationContact, trackingValue};
