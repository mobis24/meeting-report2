# 연구개발팀 업무 비서 작업 규칙

이 저장소는 연구개발팀의 반복 업무를 GitHub Copilot에게 맡기기 위한 예제입니다.
아래 규칙은 모든 요청에 적용됩니다.

## 답변 방식

- 항상 한국어로 답합니다. 코드 주석도 한국어로 작성합니다.
- 문서에 근거해서 답할 때는 어느 파일의 어느 항목을 참고했는지 함께 표시합니다.
- 근거가 되는 문서가 없으면 추측하지 않고 "문서에 없는 내용"이라고 밝힌 뒤 담당자 확인을 권합니다.
- 필요한 정보가 빠져 있으면 작업을 시작하기 전에 빠진 항목을 한 번에 모아서 물어봅니다.
- 결과 파일을 만든 뒤에는 내용을 한 번만 다시 읽어 확인하고, 별도의 검증 명령을 반복해서 실행하지 않습니다.

## 파일 규칙

- 생성한 결과물(양식, 회의록, 판정표, 보고서)은 `output/` 폴더에 저장합니다.
- `docs/` 폴더의 문서는 기준 문서입니다. 요청 없이 수정하지 않습니다.
- Word 양식(`.docx`)은 직접 고치지 않고, `node scripts/fill-docx.js`로 채운 파일을 `output/`에 만듭니다.
- `data/` 폴더의 원본 데이터는 수정하지 않습니다.
- 보안 샌드박스 파일과 비밀 값은 읽지 않거나 출력하지 않습니다.

## 코드 규칙

- 스크립트는 Node.js 내장 모듈만 사용합니다. 외부 패키지를 설치하지 않습니다.
- 판정 로직은 `docs/issue-rules.md`를 따르고, 규칙에 없는 기준을 임의로 만들지 않습니다.
- 판정 결과에는 항상 근거를 함께 남깁니다. 확실하지 않으면 미판정으로 표기합니다.
- `scripts/*.js`는 ES 모듈 형식으로 작성하고, 입력/출력 경로는 파일 상단의 상수로 관리합니다.
- 함수마다 한 줄 한국어 설명을 달고, 실행 요약을 콘솔에 남깁니다.

## 저장소 구조와 아키텍처

- `docs/`: 기준 문서와 템플릿. 질문/판정/보고서 생성의 근거 자료가 됩니다.
  - `docs/issue-rules.md`: 이슈 판정 규칙
  - `docs/report-template.md`: 보고서 마크다운 템플릿
  - `docs/report-template.docx`: Word 템플릿
  - `docs/*.md`: FAQ, 용어집, 정책 문서 등
- `data/`: 원본 입력 데이터. 회의 메모와 이슈 CSV를 보관합니다.
- `scripts/`: 핵심 자동화 스크립트
  - `triage.js`: CSV 이슈를 읽어 유형·우선순위·상태를 판정하고 `output/triage-result.{csv,md}`를 생성
  - `report.js`: 판정 결과를 보고서 마크다운으로 요약
  - `fill-docx.js`: `.docx` Word 양식에 JSON 데이터 채우기
  - `check.js`: `tests/cases.json`과 결과를 비교해 검증
- `output/`: 생성된 결과물. 커밋 대상인지 확인 후 관리합니다.
- `tests/cases.json`: 판정 로직의 검증 셋
- `.github/skills/`: 팀별 반복 업무 스킬(FAQ, 회의록, 보고서, 노트북 신청 등)
- `.github/agents/`: 작업 전용 에이전트 정의
- `.github/hooks/`: 비밀 파일 접근을 막는 보안 설정

## 실행/검증 명령

이 저장소는 `package.json`에 정의된 스크립트가 있으며, 외부 의존성 설치는 필요하지 않습니다.

```bash
# 이슈 판정 실행
node scripts/triage.js

# 판정 결과를 보고서로 생성
node scripts/report.js

# 검증셋 기준으로 결과 확인
node scripts/check.js

# Word 템플릿 채우기(예시)
node scripts/fill-docx.js docs/report-template.docx
node scripts/fill-docx.js docs/report-template.docx output/weekly-report-2026-09-04.json
```

- `npm run triage`, `npm run report`, `npm run check`도 동일하게 동작합니다.
- 전체 테스트 스위트가 별도로 있는 것은 아니며, 이 저장소의 검증 기준은 `node scripts/check.js`를 통과하는 것입니다.
- 단일 검증 케이스를 직접 확인할 때는 `node scripts/triage.js` 후 `node scripts/check.js` 흐름을 그대로 사용합니다.
- 빌드/린트 도구는 이 프로젝트에 없고, 실행 가능한 검증은 위 스크립트들입니다.

## 작업별 규칙과 관례

- 이슈 판정은 `docs/issue-rules.md`를 우선 기준으로 하며, 규칙에 없는 보조 판단을 추가하지 않습니다.
- 문서 기반 작업에서는 `docs/`를 기준 문서로 삼고 `data/`의 원본 텍스트를 확인해 근거를 남깁니다.
- 결과물은 Markdown/CSV/Word 형식으로 생성하되, 최종 산출물은 `output/`에 두어야 합니다.
- 민감한 정보는 마스킹을 유지하고, 이름은 원본 그대로 보존하되 공개용 결과물에서는 필요 시 `김OO`처럼 표기 규칙을 지킵니다.
- 코드 수정 시 기존 구조에 맞춰 작은 스크립트 단위로 유지하고, 입력·출력 경로와 실행 요약은 기존 스타일을 따라야 합니다.

## 민감 정보

- 결과물에 이름 전체, 사번, 연락처, 이메일을 적지 않습니다. 원본에 있는 그대로(`김OO`) 유지합니다.
- 데이터를 외부 서비스로 보내거나 인터넷에 올리는 작업은 사용자에게 먼저 확인합니다.
- 환경 파일이나 비밀 값은 읽거나 출력하지 않습니다.

## 추가로 확인할 문서

- `README.md`: 프로젝트 개요와 실행 흐름
- `package.json`: 실행 스크립트 정의
- `.github/instructions/scripts.instructions.md`: 스크립트 작성 규칙
