from pathlib import Path

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image as RLImage,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent
SCREEN_DIR = ROOT / "tmp" / "pdfs" / "screens"
ASSET_DIR = ROOT / "tmp" / "pdfs" / "assets"
OUTPUT_DIR = ROOT / "output" / "pdf"
LOGO = Path(r"C:\Users\steav\cloud9-care\public\medi-care-logo.png")

BLUE = colors.HexColor("#078DCC")
DEEP = colors.HexColor("#075F8F")
INK = colors.HexColor("#17262E")
MUTED = colors.HexColor("#667780")
LINE = colors.HexColor("#DCE6EA")
PALE = colors.HexColor("#F1F8FB")
GREEN = colors.HexColor("#2E8B67")
AMBER = colors.HexColor("#C98516")
WHITE = colors.white


def register_fonts():
    pdfmetrics.registerFont(TTFont("Malgun", r"C:\Windows\Fonts\malgun.ttf"))
    pdfmetrics.registerFont(TTFont("MalgunBold", r"C:\Windows\Fonts\malgunbd.ttf"))


def prepare_assets():
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    crops = {
        "customer-home-top.png": ("customer-home.png", (0, 0, 430, 760)),
        "customer-home-bottom.png": ("customer-home.png", (0, 690, 430, 1360)),
        "customer-apply-form.png": ("customer-apply.png", (0, 70, 430, 885)),
        "manager-profile-top.png": ("manager-entry.png", (0, 0, 430, 820)),
        "manager-profile-bottom.png": ("manager-entry.png", (0, 700, 430, 1430)),
    }
    for output_name, (source_name, box) in crops.items():
        source = Image.open(SCREEN_DIR / source_name).convert("RGB")
        right = min(box[2], source.width)
        bottom = min(box[3], source.height)
        source.crop((box[0], box[1], right, bottom)).save(
            ASSET_DIR / output_name, quality=92
        )


def build_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName="MalgunBold",
            fontSize=25,
            leading=34,
            textColor=INK,
            spaceAfter=8,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            fontName="Malgun",
            fontSize=11,
            leading=18,
            textColor=MUTED,
        ),
        "h1": ParagraphStyle(
            "h1",
            fontName="MalgunBold",
            fontSize=19,
            leading=26,
            textColor=INK,
            spaceAfter=10,
        ),
        "h2": ParagraphStyle(
            "h2",
            fontName="MalgunBold",
            fontSize=13,
            leading=19,
            textColor=DEEP,
            spaceBefore=5,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "body",
            fontName="Malgun",
            fontSize=9.5,
            leading=16,
            textColor=INK,
        ),
        "small": ParagraphStyle(
            "small",
            fontName="Malgun",
            fontSize=8,
            leading=13,
            textColor=MUTED,
        ),
        "center": ParagraphStyle(
            "center",
            fontName="Malgun",
            fontSize=9.5,
            leading=16,
            textColor=INK,
            alignment=TA_CENTER,
        ),
        "stepnum": ParagraphStyle(
            "stepnum",
            fontName="MalgunBold",
            fontSize=11,
            leading=15,
            textColor=WHITE,
            alignment=TA_CENTER,
        ),
        "step": ParagraphStyle(
            "step",
            fontName="Malgun",
            fontSize=9,
            leading=15,
            textColor=INK,
        ),
        "label": ParagraphStyle(
            "label",
            fontName="MalgunBold",
            fontSize=8,
            leading=12,
            textColor=BLUE,
        ),
    }


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 15 * mm, 192 * mm, 15 * mm)
    canvas.setFont("Malgun", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 9 * mm, "클라우드나인 메디케어 병원동행서비스")
    canvas.drawRightString(192 * mm, 9 * mm, str(doc.page))
    canvas.restoreState()


def image(path, width_mm):
    pic = Image.open(path)
    ratio = pic.height / pic.width
    return RLImage(str(path), width=width_mm * mm, height=width_mm * ratio * mm)


def section_header(styles, kicker, title, text):
    return [
        Paragraph(kicker, styles["label"]),
        Paragraph(title, styles["h1"]),
        Paragraph(text, styles["subtitle"]),
        Spacer(1, 5 * mm),
    ]


def step_card(styles, number, title, body, tone=BLUE):
    number_cell = Table(
        [[Paragraph(str(number), styles["stepnum"])]],
        colWidths=[9 * mm],
        rowHeights=[9 * mm],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), tone),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("BOX", (0, 0), (-1, -1), 0, tone),
            ]
        ),
    )
    copy = Paragraph(f"<b>{title}</b><br/>{body}", styles["step"])
    card = Table(
        [[number_cell, copy]],
        colWidths=[13 * mm, 151 * mm],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        ),
    )
    return KeepTogether([card, Spacer(1, 3 * mm)])


def note_box(styles, title, text, color=BLUE):
    table = Table(
        [[Paragraph(f"<b>{title}</b><br/>{text}", styles["body"])]],
        colWidths=[164 * mm],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 0.8, color),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        ),
    )
    return table


def cover(styles, audience, description):
    logo = image(LOGO, 85)
    return [
        Spacer(1, 12 * mm),
        logo,
        Spacer(1, 15 * mm),
        Paragraph("CLOUD9 MEDICARE", styles["label"]),
        Paragraph(f"{audience} 앱 사용 매뉴얼", styles["title"]),
        Paragraph(description, styles["subtitle"]),
        Spacer(1, 20 * mm),
        Table(
            [
                [Paragraph("서비스 주소", styles["small"]), Paragraph("https://cloud9-medicare.vercel.app", styles["body"])],
                [Paragraph("고객센터", styles["small"]), Paragraph("1688-9739", styles["body"])],
                [Paragraph("발행", styles["small"]), Paragraph("2026년 6월", styles["body"])],
            ],
            colWidths=[34 * mm, 112 * mm],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), PALE),
                    ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                    ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 10),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ]
            ),
        ),
        Spacer(1, 16 * mm),
        note_box(
            styles,
            "시작 전 확인",
            "휴대폰의 Chrome, Samsung Internet 또는 Safari에서 서비스 주소를 열어주세요. "
            "Google 또는 카카오 계정이 있으면 별도의 복잡한 회원가입 없이 이용할 수 있습니다.",
        ),
        PageBreak(),
    ]


def customer_story(styles):
    story = cover(
        styles,
        "고객용",
        "병원동행 신청부터 매니저 배정, 진행 상황 확인까지 고객이 사용하는 기능을 안내합니다.",
    )
    story += section_header(
        styles,
        "QUICK START",
        "1. 서비스 시작과 간편가입",
        "홈 화면에서 서비스를 살펴보고 Google 또는 카카오 계정으로 간편하게 시작합니다.",
    )
    story.append(
        Table(
            [[image(ASSET_DIR / "customer-home-top.png", 66),
              Paragraph(
                  "<b>홈 화면에서 할 수 있는 일</b><br/><br/>"
                  "• 상단의 <b>간편가입</b> 버튼으로 로그인<br/>"
                  "• <b>동행 신청</b> 버튼으로 새 일정 접수<br/>"
                  "• 진행 중 동행과 추천 매니저 확인<br/>"
                  "• 고객센터 1688-9739로 전화 연결",
                  styles["body"],
              )]],
            colWidths=[72 * mm, 91 * mm],
            style=TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]),
        )
    )
    story += [
        Spacer(1, 6 * mm),
        step_card(styles, 1, "간편가입 누르기", "홈 화면 오른쪽 위의 ‘간편가입’을 누릅니다."),
        step_card(styles, 2, "회원 유형에서 고객 선택", "고객이 선택된 상태에서 Google 또는 카카오 로그인을 선택합니다."),
        step_card(styles, 3, "계정 동의 완료", "Google 계정 선택 또는 카카오 동의 화면에서 계속하기를 누릅니다."),
        note_box(styles, "로그인이 안 될 때", "브라우저의 팝업 차단을 해제하고 다시 시도하세요. 카카오 로그인은 이메일 제공을 선택하면 회원 확인이 더 쉽습니다.", AMBER),
        PageBreak(),
    ]
    story += section_header(
        styles,
        "CARE REQUEST",
        "2. 병원동행 신청하기",
        "병원, 일정, 필요한 도움을 입력하면 운영센터가 내용을 확인하고 매니저를 배정합니다.",
    )
    story.append(
        Table(
            [[image(ASSET_DIR / "customer-apply-form.png", 67),
              Paragraph(
                  "<b>필수 입력</b><br/>• 병원명<br/>• 예약일<br/>• 예약 시간<br/><br/>"
                  "<b>입력하면 좋은 정보</b><br/>• 출발지 또는 병원 주소<br/>"
                  "• 필요한 도움 여러 개 선택<br/>• 이동 상태, 휠체어 사용 여부, 보호자 요청사항",
                  styles["body"],
              )]],
            colWidths=[73 * mm, 90 * mm],
            style=TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]),
        )
    )
    story += [
        Spacer(1, 5 * mm),
        step_card(styles, 1, "병원명과 주소 입력", "정확한 병원명과 출발 장소를 입력합니다."),
        step_card(styles, 2, "날짜와 시간 선택", "진료 예약 시간을 기준으로 입력합니다. 이동 시간을 고려해 메모에 요청사항을 남겨주세요."),
        step_card(styles, 3, "도움 항목 선택", "진료 동행, 검사 동행, 접수·수납, 약국 동행, 입퇴원 지원, 휠체어 보조 중 필요한 항목을 선택합니다."),
        step_card(styles, 4, "신청 완료", "화면 아래 신청 버튼을 누르면 운영센터로 접수됩니다."),
        PageBreak(),
    ]
    story += section_header(
        styles,
        "TRACKING",
        "3. 배정과 진행 상황 확인",
        "홈과 내역 메뉴에서 접수 상태와 담당 매니저 정보를 확인할 수 있습니다.",
    )
    story.append(
        Table(
            [[image(ASSET_DIR / "customer-home-bottom.png", 70),
              Paragraph(
                  "<b>진행 상태 순서</b><br/><br/>"
                  "매칭 대기 → 매칭 완료 → 출발 중 → 병원 도착 → 동행 중 → 완료<br/><br/>"
                  "매니저가 배정되면 이름, 평점, 연락처가 표시됩니다. "
                  "완료되거나 취소된 신청은 하단 <b>내역</b> 메뉴에서 확인합니다.",
                  styles["body"],
              )]],
            colWidths=[76 * mm, 87 * mm],
            style=TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]),
        )
    )
    story += [
        Spacer(1, 7 * mm),
        note_box(styles, "긴급 변경이나 취소", "진료 일정 변경, 출발지 변경, 당일 취소처럼 즉시 확인이 필요한 내용은 고객센터 1688-9739로 연락해주세요.", AMBER),
        Spacer(1, 8 * mm),
        Paragraph("개인정보와 안전", styles["h2"]),
        Paragraph(
            "신청 메모에는 동행에 필요한 정보만 입력하세요. 주민등록번호, 계좌 비밀번호 등 불필요한 민감정보는 입력하지 않습니다. "
            "매니저와의 연락은 배정된 일정 확인과 병원동행 업무에 필요한 범위에서 이용해주세요.",
            styles["body"],
        ),
        PageBreak(),
        Paragraph("HELP", styles["label"]),
        Paragraph("자주 묻는 질문", styles["h2"]),
        Paragraph("서비스 이용 중 자주 확인하는 내용을 모았습니다.", styles["subtitle"]),
        Spacer(1, 6 * mm),
        step_card(styles, "Q", "신청 후 바로 매니저가 보이지 않아요.", "운영센터 확인과 배정 전에는 ‘매칭 대기’로 표시됩니다.", DEEP),
        step_card(styles, "Q", "신청 내용을 수정하고 싶어요.", "현재 화면에서 직접 수정하는 기능은 준비 중입니다. 고객센터로 변경 내용을 알려주세요.", DEEP),
        step_card(styles, "Q", "카카오나 Google 가입 정보를 어디서 확인하나요?", "관리자가 가입 회원 목록에서 가입 방식과 최근 로그인 정보를 확인할 수 있습니다.", DEEP),
        Spacer(1, 8 * mm),
        note_box(
            styles,
            "고객센터",
            "전화 1688-9739 / 서비스 주소 https://cloud9-medicare.vercel.app",
            BLUE,
        ),
    ]
    return story


def manager_story(styles):
    story = cover(
        styles,
        "매니저용",
        "매니저 간편가입, 지원정보 작성, 증빙서류 제출과 심사 상태 확인 방법을 안내합니다.",
    )
    story += section_header(
        styles,
        "MANAGER START",
        "1. 매니저 계정 시작하기",
        "매니저 지원센터에서 Google, 카카오 또는 이메일 계정으로 시작합니다.",
    )
    story += [
        step_card(styles, 1, "매니저 지원센터 열기", "서비스 홈 아래쪽의 ‘지원하기’를 누르거나 /manager 주소로 이동합니다."),
        step_card(styles, 2, "간편가입 또는 이메일 가입", "Google·카카오 계정을 선택하거나 이메일과 비밀번호로 계정을 만듭니다."),
        step_card(styles, 3, "이메일 확인", "이메일 가입자는 받은 메일의 인증 링크를 완료한 뒤 로그인합니다."),
        step_card(styles, 4, "지원정보 화면 진입", "로그인이 완료되면 매니저 지원정보 입력 화면이 열립니다."),
        Spacer(1, 6 * mm),
        note_box(styles, "카카오 가입 안내", "카카오 로그인 동의 화면에서 닉네임, 프로필 사진, 이메일 제공 여부를 확인한 후 계속하기를 누릅니다."),
        PageBreak(),
    ]
    story += section_header(
        styles,
        "PROFILE",
        "2. 기본정보와 서류 입력",
        "고객과 안전하게 매칭할 수 있도록 실제 활동 정보를 정확히 작성합니다.",
    )
    story.append(
        Table(
            [[image(ASSET_DIR / "manager-profile-top.png", 69),
              Paragraph(
                  "<b>기본정보 체크</b><br/><br/>"
                  "• 이름과 연락처는 실제 정보 입력<br/>"
                  "• 출생연도는 숫자로 입력<br/>"
                  "• 주요 활동 지역은 구 단위까지 구체적으로 작성<br/>"
                  "• 관련 경력 선택<br/>"
                  "• 자격증·경력 서류는 PDF, JPG 또는 PNG로 첨부",
                  styles["body"],
              )]],
            colWidths=[75 * mm, 88 * mm],
            style=TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]),
        )
    )
    story += [
        Spacer(1, 6 * mm),
        note_box(styles, "서류 촬영 요령", "문서 전체가 잘리지 않도록 밝은 곳에서 촬영하고, 이름과 자격 내용이 선명한 파일을 올려주세요.", GREEN),
        PageBreak(),
    ]
    story += section_header(
        styles,
        "SERVICE SKILLS",
        "3. 가능한 동행 서비스 선택",
        "실제로 수행할 수 있는 업무만 선택해야 정확한 고객 매칭이 가능합니다.",
    )
    story.append(
        Table(
            [[image(ASSET_DIR / "manager-profile-bottom.png", 71),
              Paragraph(
                  "<b>선택 가능한 업무 예시</b><br/><br/>"
                  "• 대학병원 및 초진 안내<br/>• 검사 동행<br/>• 재활 동행<br/>"
                  "• 휠체어 이동 보조<br/>• 입퇴원 지원<br/>• 약국 동행<br/>• 보호자 보고<br/><br/>"
                  "차량 이동 지원과 휠체어 보조 가능 여부는 별도 체크합니다. "
                  "소개란에는 경력, 강점, 고객을 대하는 방식 등을 500자 이내로 작성합니다.",
                  styles["body"],
              )]],
            colWidths=[77 * mm, 86 * mm],
            style=TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]),
        )
    )
    story += [
        Spacer(1, 6 * mm),
        step_card(styles, 1, "서비스 항목 선택", "누르면 선택 상태가 표시됩니다. 다시 누르면 해제됩니다."),
        step_card(styles, 2, "이동 지원 여부 체크", "자차 또는 휠체어 지원이 실제 가능한 경우에만 체크합니다."),
        step_card(styles, 3, "소개 작성", "병원동행 경험, 응대 강점, 기록·보고 방식 등을 구체적으로 작성합니다."),
        step_card(styles, 4, "지원서 제출", "화면 하단의 제출 버튼을 누르고 저장 완료 안내를 확인합니다."),
        PageBreak(),
    ]
    story += section_header(
        styles,
        "REVIEW",
        "4. 심사 상태와 정보 수정",
        "제출 후 지원정보 화면 상단에서 현재 심사 상태를 확인할 수 있습니다.",
    )
    story += [
        Table(
            [
                [Paragraph("<b>검토 대기</b>", styles["body"]), Paragraph("운영센터가 지원서와 서류를 확인 중입니다.", styles["body"])],
                [Paragraph("<b>승인 완료</b>", styles["body"]), Paragraph("매니저 등록 절차가 승인된 상태입니다.", styles["body"])],
                [Paragraph("<b>보완 요청</b>", styles["body"]), Paragraph("정보 또는 서류를 수정한 뒤 다시 저장해주세요.", styles["body"])],
            ],
            colWidths=[37 * mm, 127 * mm],
            style=TableStyle(
                [
                    ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                    ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
                    ("BACKGROUND", (0, 0), (0, -1), PALE),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 9),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                    ("TOPPADDING", (0, 0), (-1, -1), 9),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
                ]
            ),
        ),
        Spacer(1, 8 * mm),
        Paragraph("정보 수정 방법", styles["h2"]),
        Paragraph(
            "로그인 후 기존 지원정보가 자동으로 표시됩니다. 연락처, 활동 지역, 경력, 서비스 항목 또는 소개를 수정하고 "
            "‘정보 수정하기’를 누르면 최신 정보가 저장됩니다. 새 서류를 선택하면 기존 제출정보에 새 파일이 연결됩니다.",
            styles["body"],
        ),
        Spacer(1, 8 * mm),
        note_box(
            styles,
            "안전한 계정 관리",
            "공용 PC 사용 후에는 반드시 로그아웃하세요. 계정 비밀번호와 인증번호는 운영자나 고객에게도 공유하지 않습니다.",
            AMBER,
        ),
        Spacer(1, 8 * mm),
        Paragraph("문의가 필요한 경우", styles["h2"]),
        Paragraph(
            "지원서 저장 오류, 서류 업로드 실패, 심사 상태 문의는 클라우드나인 메디케어 운영센터로 연락해주세요. "
            "문의 시 가입 이메일과 이름을 알려주면 빠르게 확인할 수 있습니다.",
            styles["body"],
        ),
    ]
    return story


def build_pdf(path, story, title):
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=20 * mm,
        title=title,
        author="클라우드나인 메디케어",
    )
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def main():
    register_fonts()
    prepare_assets()
    styles = build_styles()
    build_pdf(
        OUTPUT_DIR / "cloud9_customer_user_manual.pdf",
        customer_story(styles),
        "클라우드나인 메디케어 고객용 앱 사용 매뉴얼",
    )
    build_pdf(
        OUTPUT_DIR / "cloud9_manager_user_manual.pdf",
        manager_story(styles),
        "클라우드나인 메디케어 매니저용 앱 사용 매뉴얼",
    )
    print("created")


if __name__ == "__main__":
    main()
