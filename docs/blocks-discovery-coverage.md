# SELISE Blocks Discovery Coverage

Disposable lab project for SELISE Blocks end-to-end discovery.

## Project

- Repository: https://github.com/alviehsan/selise_blocks_lab_a5
- Local path: `/Users/alviehsan/Projects/Blocks/selise_blocks_lab_a5`
- Blocks project: `selise_blocks_lab_a5`
- Development project itemId: `dd0e1af6-7571-4e69-b89d-cd62e1a38d7a`
- Production project itemId: `6c7cb78d-253a-4a9a-b3c7-2f6b3e97a95d`
- Development domain: https://dbwwce-eeojx.seliseblocks.com
- Production domain: https://pbwwce-eeojx.seliseblocks.com

## CLI And Repo

| Area | Path/Command | Result | Notes |
| --- | --- | --- | --- |
| CLI availability | `blocks --help` | Verified | CLI version `@seliseblocks/cli v0.0.35`; commands: `setup`, `login`, `logout`, `auth`, `projects`, `uilm`, `new`, `version`. |
| CLI auth | `blocks auth` | Verified | Authenticated as `alviehsan@live.com` after local refresh-token renewal. No token values printed. |
| GitHub auth | `gh auth status` | Verified | Account `alviehsan`; repo/workflow scopes available. |
| GitHub repo | `git remote -v` / GitHub | Verified | `alviehsan/selise_blocks_lab_a5`. |
| Local app tests | `npm test` | Verified | 2 Vitest tests passed in earlier run. |
| Local app build | `npm run build` | Verified | Vite production build passed in earlier run. |

## CloudBuild And Deployment

| Area | UI/API Path | Result | Evidence |
| --- | --- | --- | --- |
| Development repo attach | Dev project > Deployment | Verified | Repo itemId `9f667f0a-0e6f-4d44-b121-92b695902177`, branch `dev`, status `Succeeded`, manual deployment. |
| Production repo attach | Prod project > Deployment | Verified | Repo itemId `4ce8b3e9-768d-4ba6-a557-0d4d33f16812`, branch `main`, status `Succeeded`, manual deployment. |
| Failed build diagnosis | CloudBuild build `1e70e01d-1351-4a4c-812a-df6774d202e3` | Verified | Initial failure: missing Dockerfile. Fixed by adding Docker deployment config. |
| Development deployment | CloudBuild build `fb88b61c-d4c2-4721-9be3-1e93b86a3a18` | Verified | Succeeded; dev domain returned HTTP 200. |
| Production deployment | CloudBuild build `b0684c09-c63d-4057-86a8-9e0b66be12ca` | Verified | Succeeded; prod domain returned HTTP 200. |
| Health checks | `/healthz` on dev/prod domains | Verified | Both returned HTTP 200. |
| Git-based auto deploy | Deployment settings | Untested | Need verify webhook/Git based deployment and push-trigger behavior. |

## Data Gateway

| Area | UI/API Path | Result | Evidence |
| --- | --- | --- | --- |
| Swagger discovery | `/uds/v1/swagger/v1/swagger.json` | Verified | Groups found: Configuration, DataAccess, DataManage, DataSource, DataValidation, Deployment, Files, Schema, SchemaExchange. |
| Schema list | Data Gateway > Schemas | Verified | Dev schema list accessible with CLI auth and global Blocks key. |
| Schema creation | `LabNote` | Verified | Schema id `7c698280-d8f7-4688-ae84-a42f39e31ba5`. |
| Fields | `LabNote` fields | Verified | `Title`, `Status`, `OwnerUserId`, `DueAt`, plus system fields. |
| Validation | `Title` required | Verified | Validation id `3cbc1c2f-e8c8-4631-8da0-dacc77af2d9e`, error `Title is required`. |
| Access policy | Data access security | Verified | Read/Edit/Delete custom owner policy; Write logged-in users. |
| Owner/RLS policy | CreatedBy equals auth claim userId | Verified | Policy ids: read `a9c6f63e-2dbc-41c3-854c-2d621ebb97a0`, edit `a281aaff-dce2-4270-a8a4-7c2e82b4dc3a`, delete `b9d97e2b-57d8-4028-bf61-07a4b146ea55`. |
| Config reload | `POST /uds/v1/configurations/{projectKey}/reload` | Verified | Reload endpoint accepted. |
| Deployment pipeline | `GET /uds/v1/deployment/pipeline?projectKey=...` | Verified | Returned `true`. |
| Data source configure | Data Gateway > Configure | Partial | Data source exists, but `isActive:false` remains after update/confirm. |
| Gateway health | `/uds/v1/dbwwce/ping` | Blocked | Returns 404. |
| GraphQL CRUD | `/uds/v1/dbwwce/gateway` and UI Playground | Blocked | HTTP 404 from gateway endpoint; Playground returned `{ "error": "Error: [object Object]" }`. |

## Identity And Security

| Area | UI Path | Result | Evidence |
| --- | --- | --- | --- |
| Authentication page | Services > Authentication | Verified | Tabs: API Docs, Logs, General, Client Credential, OIDC, SSO, External IdP. |
| OIDC client | Authentication > OIDC | Verified | Created dev client `Blocks Lab a5 Dev`; redirect `https://dbwwce-eeojx.seliseblocks.com/oidc`; OpenID scope. Secret/client values masked and not recorded. |
| IAM overview | Services > IAM | Verified | Tabs: Configure, Organizations, Users, Roles, Permissions, Signup Settings, Invite User. |
| Project people | Project > People | Verified | Owner `Alvi Ehsan`, email `alviehsan@live.com`, envs Development/Production. |
| Client credentials | Authentication > Client Credential | Untested | Need switch/create/test flow. |
| MFA | Services > MFA | Untested | Need inspect workflow. |
| Captcha | Services > Captcha | Untested | Need inspect workflow; ask before solving any CAPTCHA. |

## Observability

| Area | UI Path | Result | Evidence |
| --- | --- | --- | --- |
| Health dashboard | Observability > Health | Verified | All services/Blocks services/Deployed services/My services tabs; services showed 100% in table. |
| Tracing | Observability > Tracing | Verified | Hot/Cold/Archive/Guide/Ask AI; UDS requests visible. |
| Logs | Data Gateway > Logs | Verified | UDS API requests/traces visible. |
| Usage/quota | Observability > Usages | Untested | Need inspect. |
| App monitoring add | Deployment detail > Monitoring > Add | Untested | Need create or verify monitor config. |

## Remaining Console Areas

| Area | UI Path | Status | Notes |
| --- | --- | --- | --- |
| AI Agents | AI > Agents | Untested | Need create/test safe agent if no provider secret required. |
| AI Knowledge Base | AI > Knowledge Base | Untested | Need create/test sample doc if upload is allowed. |
| AI Tools | AI > Tools | Untested | Need inspect tool creation/use. |
| AI Models | AI > Models | Untested | Need inspect provider/model requirements; do not enter external API secrets. |
| Workflow | Workflow | Untested | Need create/test minimal workflow if allowed. |
| Storage | Services > Storage | Untested | Need test bucket/file flow with harmless generated test file. |
| Language/UILM | Services > Language, `blocks uilm` | Untested | Need test language/glossary/translation commands and UI. |
| Email utility | Utilities > Email | Untested | Need inspect; confirm before sending external mail. |
| Notifications | Utilities > Notifications | Untested | Need inspect; confirm before external send. |
| Magic URL | Utilities > Magic URL | Untested | Need inspect/generate safe URL flow. |
| Settings | Project/settings screens | Untested | Need inspect non-destructive settings. |

## AI Findings

| Area | UI Path | Result | Evidence |
| --- | --- | --- | --- |
| Knowledge Base folder | AI > Knowledge Base > Add Folder | Verified | Created `Blocks Lab Notes` folder with default Blocks/Azure/Text Embedding ADA 002 model and Recursive chunking. |
| Knowledge Base tabs | Folder detail > Files/Links/Writeups/Q&A | Verified | All tabs load; each has add flow. File upload supports text/PDF only, max 5 files, 5 MB each. Browser automation could not attach file through this runtime. |
| Knowledge Base writeup | Folder detail > Writeups > Add Writeup | Partial | Created a no-secret lab writeup. It stayed `pending`, `0` chunks after about 30 seconds. |
| Agent creation | AI > Agents > Add Agent | Verified | Created `General Assistant` using predefined template and Sequential agent type. |
| Agent preview | Agent detail > Preview | Verified | Sent `Reply with the word ready if you are active.`; agent replied `Ready`. |
| Agent publish | Agent detail > Publish | Verified | Publish returned `Agent published successfully`. |
| Agent configuration sections | Agent detail > Configuration | Verified | Sections present: LLM, Knowledge Base, Tools, Memory, Welcome Guide, Human Handoff (Coming Soon), Guardrails. |
| Tool creation | AI > Tools > Add Tool | Verified | Created `Blocks Lab Health Tool` with base URL `https://dbwwce-eeojx.seliseblocks.com`, no auth. |
| Tool API action | Tool detail > API > Create API | Verified | Created GET `/healthz` action through 4-step wizard: Basic Information, Input Parameters, Output Parameters, Debugging. |
| Tool API debug | Create API > Debugging > Run Debug | Verified | Debug succeeded; response contained base64 `b2sK` for `ok\n`; action status became `Tested`. |
