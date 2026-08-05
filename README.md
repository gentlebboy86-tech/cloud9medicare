<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/69a39308-5eaa-431d-b705-0e482cf6b342

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Meta Lead Ads to Supabase

1. Run `supabase-leads.sql` in the Supabase SQL editor.
2. Add the values from `.env.example` to Vercel project environment variables.
3. In Zapier, use **Meta Lead Ads** as the trigger and **Webhooks by Zapier** as the action.
4. Send a `POST` request to `https://YOUR_DOMAIN/api/meta-lead`.
5. Add this request header: `Authorization: Bearer YOUR_RANDOM_SECRET`.
6. Map Meta form fields into the request body. For the current consulting campaign, supported names include `name`, `phone_number`, `representative_name`, `contact_phone`, `opening_area`, `center_name`, `business_type`, `requested_service`, and `memo`. If `requested_service` is empty, the API stores `주간보호센터 방문요양 컨설팅`.

The manager screen reads `/api/leads` every 15 seconds when `VITE_LEADS_DASHBOARD_TOKEN` is set. Kakao Alimtalk delivery can be attached through `LEAD_NOTIFICATION_WEBHOOK_URL`, which should point to your Kakao bizmessage provider, Zapier, Make, or an internal relay.

## Customer Auto Reply

`/api/meta-lead` can send an automatic customer reply after the lead is saved.

For the fastest SMS setup, add these Vercel environment variables after creating a Solapi/Nurigo API key and registering a sender number:

```text
CUSTOMER_AUTO_REPLY_ENABLED=true
CUSTOMER_AUTO_REPLY_TEXT=주간보호센터/방문요양 컨설팅 상담 신청이 접수되었습니다. 클라우드나인메디케어 담당자가 확인 후 연락드리겠습니다.
SOLAPI_API_KEY=
SOLAPI_API_SECRET=
SOLAPI_SENDER_PHONE=
```

Alternatively, set `CUSTOMER_AUTO_REPLY_WEBHOOK_URL` to a Zapier, Make, or Kakao bizmessage relay endpoint. If both webhook and Solapi values are present, the webhook is used first.
