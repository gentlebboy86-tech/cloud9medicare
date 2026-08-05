import {
  getBearerToken,
  jsonResponse,
  normalizeLead,
  notifyCustomer,
  notifyLead,
  readJsonBody,
  supabaseFetch,
  unauthorized,
} from './_lead-utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonResponse(res, 405, {error: 'method_not_allowed'});
  }

  if (process.env.LEAD_WEBHOOK_SECRET && getBearerToken(req) !== process.env.LEAD_WEBHOOK_SECRET) {
    return unauthorized(res);
  }

  try {
    const payload = await readJsonBody(req);
    const lead = normalizeLead(payload);

    if (!lead.guardian_phone && !lead.patient_name) {
      return jsonResponse(res, 400, {error: 'lead must include at least a name or phone number'});
    }

    const [savedLead] = await supabaseFetch('leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(lead),
    });

    const [notification, customerAutoReply] = await Promise.all([
      notifyLead(savedLead),
      notifyCustomer(savedLead),
    ]);

    return jsonResponse(res, 200, {ok: true, lead: savedLead, notification, customerAutoReply});
  } catch (error) {
    console.error(error);
    return jsonResponse(res, 500, {error: error.message ?? 'internal_error'});
  }
}
