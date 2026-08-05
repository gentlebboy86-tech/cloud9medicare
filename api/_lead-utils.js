import crypto from 'node:crypto';

const CARE_CONSULTING_SERVICE = '\uc8fc\uac04\ubcf4\ud638\uc13c\ud130 \ubc29\ubb38\uc694\uc591 \ucee8\uc124\ud305';
const CARE_CONSULTING_REPLY =
  '\uc8fc\uac04\ubcf4\ud638\uc13c\ud130/\ubc29\ubb38\uc694\uc591 \ucee8\uc124\ud305 \uc0c1\ub2f4 \uc2e0\uccad\uc774 \uc811\uc218\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \ud074\ub77c\uc6b0\ub4dc\ub098\uc778\uba54\ub514\ucf00\uc5b4 \ub2f4\ub2f9\uc790\uac00 \ud655\uc778 \ud6c4 \uc5f0\ub77d\ub4dc\ub9ac\uaca0\uc2b5\ub2c8\ub2e4.';

const jsonResponse = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

const unauthorized = (res) => jsonResponse(res, 401, {error: 'unauthorized'});

const readJsonBody = async (req) => {
  if (req.body && typeof req.body === 'object') return req.body;

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    const params = new URLSearchParams(raw);
    return Object.fromEntries(params.entries());
  }
};

const getBearerToken = (req) => {
  const header = req.headers.authorization ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? '';
};

const assertServerEnv = () => {
  const missing = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'].filter((key) => !process.env[key]);
  if (missing.length > 0) throw new Error(`Missing server env: ${missing.join(', ')}`);
};

const pickFirst = (source, keys) => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
    if (Array.isArray(value) && value[0]) return String(value[0]).trim();
  }
  return '';
};

const normalizeLead = (payload) => {
  const nestedPayload = payload.data && typeof payload.data === 'object' ? payload.data : {};
  const fieldData = Array.isArray(payload.field_data)
    ? payload.field_data.reduce((acc, field) => {
        if (field?.name && Array.isArray(field.values)) acc[field.name] = field.values[0] ?? '';
        return acc;
      }, {})
    : {};

  const source = {...payload, ...nestedPayload, ...fieldData};

  const patientName = pickFirst(source, [
    'patient_name',
    'guardian_name',
    'customer_name',
    'representative_name',
    'director_name',
    'contact_name',
    'applicant_name',
    'name',
    'full_name',
    'Full Name',
    'full name',
    '\uc774\ub984',
    '\uc131\ud568',
    '\uace0\uac1d\uba85',
    '\ub300\ud45c\uc790\uba85',
    '\ub2f4\ub2f9\uc790\uba85',
    '\uc6d0\uc7a5\ub2d8\uc131\ud568',
  ]);

  const guardianPhone = pickFirst(source, [
    'guardian_phone',
    'customer_phone',
    'contact_phone',
    'representative_phone',
    'phone_number',
    'phone',
    'mobile',
    'tel',
    'Phone Number',
    'phone number',
    '\uc804\ud654\ubc88\ud638',
    '\uc5f0\ub77d\ucc98',
    '\ud734\ub300\ud3f0',
    '\ub300\ud45c\uc790\uc5f0\ub77d\ucc98',
    '\ub2f4\ub2f9\uc790\uc5f0\ub77d\ucc98',
  ]);

  const area = pickFirst(source, [
    'area',
    'region',
    'city',
    'location',
    'opening_area',
    'service_area',
    '\uc9c0\uc5ed',
    '\uac70\uc8fc\uc9c0\uc5ed',
    '\ud76c\ub9dd\uc9c0\uc5ed',
    '\uac1c\uc124\ud76c\ub9dd\uc9c0\uc5ed',
    '\uc0ac\uc5c5\uc9c0\uc5ed',
  ]);

  const centerName = pickFirst(source, [
    'hospital',
    'clinic',
    'center_name',
    'facility_name',
    'business_name',
    '\uc13c\ud130\uba85',
    '\uae30\uad00\uba85',
    '\uc0ac\uc5c5\uc7a5\uba85',
  ]);

  const requestedService =
    pickFirst(source, [
      'requested_service',
      'service',
      'consulting_type',
      'business_type',
      'ad_offer',
      '\uc11c\ube44\uc2a4',
      '\ud76c\ub9dd\uc11c\ube44\uc2a4',
      '\uc0c1\ub2f4\uc720\ud615',
      '\ucee8\uc124\ud305\uc720\ud615',
      '\uc0ac\uc5c5\uc720\ud615',
    ]) || CARE_CONSULTING_SERVICE;

  const memo = pickFirst(source, [
    'memo',
    'message',
    'note',
    'question',
    'inquiry',
    '\ubb38\uc758\ub0b4\uc6a9',
    '\uba54\ubaa8',
    '\uc694\uccad\uc0ac\ud56d',
  ]);

  return {
    source: 'meta_lead_ads',
    external_id: pickFirst(source, ['id', 'leadgen_id', 'lead_id']),
    form_id: pickFirst(source, ['form_id']),
    campaign_id: pickFirst(source, ['campaign_id']),
    ad_id: pickFirst(source, ['ad_id']),
    patient_name: patientName,
    guardian_phone: guardianPhone,
    area,
    hospital: centerName,
    requested_service: requestedService,
    memo,
    raw_payload: payload,
    status: 'new',
  };
};

const supabaseFetch = async (path, options = {}) => {
  assertServerEnv();

  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      ...options.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) throw new Error(data?.message ?? `Supabase request failed: ${response.status}`);
  return data;
};

const normalizePhone = (phone) => String(phone ?? '').replace(/[^\d]/g, '');

const solapiAuthorization = ({apiKey, apiSecret}) => {
  const date = new Date().toISOString();
  const salt = crypto.randomUUID();
  const signature = crypto.createHmac('sha256', apiSecret).update(date + salt).digest('hex');
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
};

const sendSolapiSms = async ({to, text}) => {
  const required = ['SOLAPI_API_KEY', 'SOLAPI_API_SECRET', 'SOLAPI_SENDER_PHONE'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    return {sent: false, reason: `Missing Solapi env: ${missing.join(', ')}`};
  }

  const recipient = normalizePhone(to);
  if (!recipient) return {sent: false, reason: 'recipient phone number is empty'};

  const response = await fetch('https://api.solapi.com/messages/v4/send', {
    method: 'POST',
    headers: {
      Authorization: solapiAuthorization({
        apiKey: process.env.SOLAPI_API_KEY,
        apiSecret: process.env.SOLAPI_API_SECRET,
      }),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        to: recipient,
        from: normalizePhone(process.env.SOLAPI_SENDER_PHONE),
        text,
      },
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return {
      sent: false,
      reason: data?.errorMessage ?? data?.message ?? `Solapi request failed: ${response.status}`,
      details: data,
    };
  }

  return {sent: true, provider: 'solapi', details: data};
};

const leadSummaryText = (lead) => {
  const name = lead.patient_name || 'no name';
  const phone = lead.guardian_phone || 'no phone';
  const area = lead.area || 'no area';
  const service = lead.requested_service || CARE_CONSULTING_SERVICE;
  return `[Meta Lead - Care Consulting] ${service} / ${name} / ${phone} / ${area}`;
};

const managerNotificationText = (lead) =>
  process.env.LEAD_MANAGER_NOTIFICATION_TEXT || leadSummaryText(lead);

const notifyLead = async (lead) => {
  if (process.env.LEAD_NOTIFICATION_WEBHOOK_URL) {
    const response = await fetch(process.env.LEAD_NOTIFICATION_WEBHOOK_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        channel: 'kakao_alimtalk',
        template: process.env.KAKAO_ALIMTALK_TEMPLATE_CODE ?? 'cloud9_new_lead',
        managerPhone: process.env.LEAD_MANAGER_PHONE ?? '',
        lead,
        text: managerNotificationText(lead),
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Notification webhook failed: ${response.status} ${message}`);
    }

    return {sent: true, provider: 'webhook'};
  }

  if (process.env.LEAD_MANAGER_SMS_ENABLED === 'true') {
    return sendSolapiSms({
      to: process.env.LEAD_MANAGER_PHONE,
      text: managerNotificationText(lead),
    });
  }

  return {sent: false, reason: 'manager notification is not configured'};
};

const customerAutoReplyText = (lead) => {
  const name = lead.patient_name ? `${lead.patient_name}\ub2d8, ` : '';
  return process.env.CUSTOMER_AUTO_REPLY_TEXT || `${name}${CARE_CONSULTING_REPLY}`;
};

const notifyCustomer = async (lead) => {
  if (process.env.CUSTOMER_AUTO_REPLY_ENABLED !== 'true') {
    return {sent: false, reason: 'CUSTOMER_AUTO_REPLY_ENABLED is not true'};
  }

  if (process.env.CUSTOMER_AUTO_REPLY_WEBHOOK_URL) {
    const response = await fetch(process.env.CUSTOMER_AUTO_REPLY_WEBHOOK_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        channel: process.env.CUSTOMER_AUTO_REPLY_CHANNEL ?? 'sms',
        to: lead.guardian_phone,
        lead,
        text: customerAutoReplyText(lead),
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      return {sent: false, reason: `Customer webhook failed: ${response.status} ${message}`};
    }

    return {sent: true, provider: 'webhook'};
  }

  return sendSolapiSms({
    to: lead.guardian_phone,
    text: customerAutoReplyText(lead),
  });
};

export {
  getBearerToken,
  jsonResponse,
  normalizeLead,
  notifyCustomer,
  notifyLead,
  readJsonBody,
  supabaseFetch,
  unauthorized,
};
