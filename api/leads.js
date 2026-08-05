import {getBearerToken, jsonResponse, supabaseFetch, unauthorized} from './_lead-utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return jsonResponse(res, 405, {error: 'method_not_allowed'});
  }

  if (process.env.LEADS_DASHBOARD_TOKEN && getBearerToken(req) !== process.env.LEADS_DASHBOARD_TOKEN) {
    return unauthorized(res);
  }

  try {
    const leads = await supabaseFetch(
      'leads?select=id,created_at,patient_name,guardian_phone,area,hospital,requested_service,memo,status&order=created_at.desc&limit=8',
    );
    return jsonResponse(res, 200, {leads});
  } catch (error) {
    console.error(error);
    return jsonResponse(res, 500, {error: error.message ?? 'internal_error'});
  }
}
