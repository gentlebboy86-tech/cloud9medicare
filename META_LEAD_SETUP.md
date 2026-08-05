# Meta Lead Ads 자동화 설정

## 전체 흐름

```text
Meta 리드폼 제출
→ Zapier Facebook Lead Ads 트리거
→ /api/meta-lead
→ Supabase leads 테이블 저장
→ 선택: 담당자 알림
→ 선택: 고객 자동응답 문자
```

## Vercel 환경변수

필수:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
LEAD_WEBHOOK_SECRET=
```

매니저 화면용:

```text
LEADS_DASHBOARD_TOKEN=
VITE_LEADS_DASHBOARD_TOKEN=
```

담당자 알림용:

```text
LEAD_NOTIFICATION_WEBHOOK_URL=
LEAD_MANAGER_PHONE=
KAKAO_ALIMTALK_TEMPLATE_CODE=cloud9_new_lead
```

담당자 문자 알림용:

```text
LEAD_MANAGER_SMS_ENABLED=true
LEAD_MANAGER_PHONE=01000000000
LEAD_MANAGER_NOTIFICATION_TEXT=[Meta Lead - Care Consulting] 주간보호센터/방문요양 컨설팅 상담 신청이 접수되었습니다.
```

고객 자동응답 문자용:

```text
CUSTOMER_AUTO_REPLY_ENABLED=true
CUSTOMER_AUTO_REPLY_TEXT=주간보호센터/방문요양 컨설팅 상담 신청이 접수되었습니다. 클라우드나인메디케어 담당자가 확인 후 연락드리겠습니다.
SOLAPI_API_KEY=
SOLAPI_API_SECRET=
SOLAPI_SENDER_PHONE=
```

`SOLAPI_SENDER_PHONE`은 솔라피/누리고에서 등록 및 승인된 발신번호여야 합니다.

## Zapier 설정

Trigger:

```text
Facebook Lead Ads (for Business admins)
Event: New Lead
```

Action:

```text
Webhooks by Zapier
Event: POST
URL: https://YOUR_DOMAIN/api/meta-lead
Payload Type: Json
Header:
  Authorization: Bearer LEAD_WEBHOOK_SECRET
  Content-Type: application/json
```

Body 예시:

```json
{
  "name": "{{Full Name}}",
  "phone_number": "{{Phone Number}}",
  "requested_service": "주간보호센터 방문요양 컨설팅",
  "opening_area": "{{희망 지역}}",
  "leadgen_id": "{{Leadgen Id}}",
  "form_id": "{{Form Id}}",
  "campaign_id": "{{Campaign Id}}",
  "ad_id": "{{Ad Id}}"
}
```

## 현재 주의사항

카카오 알림톡은 비즈니스 채널, 발송업체, 승인된 템플릿이 필요합니다. 승인 전에는 SMS 자동응답이 가장 빠릅니다.
