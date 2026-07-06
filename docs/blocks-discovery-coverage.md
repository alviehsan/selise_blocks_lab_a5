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
| Local app tests | `npm test -- --run` | Verified | 3 Vitest tests passed on 2026-07-06. |
| Local app build | `npm run build` | Verified | Vite production build passed on 2026-07-06. |

## CloudBuild And Deployment

| Area | UI/API Path | Result | Evidence |
| --- | --- | --- | --- |
| Development repo attach | Dev project > Deployment | Verified | Repo itemId `9f667f0a-0e6f-4d44-b121-92b695902177`, branch `dev`, status `Succeeded`, manual deployment. |
| Production repo attach | Prod project > Deployment | Verified | Repo itemId `4ce8b3e9-768d-4ba6-a557-0d4d33f16812`, branch `main`, status `Succeeded`, manual deployment. |
| Failed build diagnosis | CloudBuild build `1e70e01d-1351-4a4c-812a-df6774d202e3` | Verified | Initial failure: missing Dockerfile. Fixed by adding Docker deployment config. |
| Development deployment | CloudBuild build `fb88b61c-d4c2-4721-9be3-1e93b86a3a18` | Verified | Succeeded; dev domain returned HTTP 200. |
| Production deployment | CloudBuild build `b0684c09-c63d-4057-86a8-9e0b66be12ca` | Verified | Succeeded; prod domain returned HTTP 200. |
| Health checks | `/healthz` on dev/prod domains | Verified | Both returned HTTP 200. |
| Git-based auto deploy | Deployment settings | Verified limitation | Repo webhooks exist but are inactive and deployment type is Manual. Pushing to `main`/`dev` did not auto-deploy. |
| Report-lab app expansion | GitHub push to `main` and `dev` | Verified | Commit `cef80f6` pushed; report-builder bundle now deployed to dev/prod after manual CloudBuild API run. |
| CLI/API deploy after app expansion | `/cloudbuild/v1/Build/run-build` | Verified | CLI has no `blocks deploy`; CLI-equivalent deployment works through CloudBuild API with CLI auth. Critical finding: `ProjectKey` must be environment itemId, not short slug. Dev build `1c6c8b59-c4dc-4d3c-86d8-f5a86d2fe8e8` succeeded; prod build `a2d8d393-505f-4ea2-bfba-625e251da3a7` succeeded. |
| Deployment verification | Hosted asset bundles | Verified | Dev/prod JS bundle `index-CdFZRTlr.js` contains `Report Builder` and `/healthz`; `/healthz` returns `ok` on both domains. |

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
| Data source configure | Data Gateway > Configure + API | Partial | Correct routes are `/uds/v1/data-sources/{projectKey}/get` and `/uds/v1/data-sources/get?projectKey=...`. Data source exists with `projectShortKey: dbwwce`, but `isActive:false` remains. `PUT /uds/v1/data-sources/update` returns 200/acknowledged with `totalImpactedData:0`; `ConnectionString` is required if using update body. |
| Gateway health | `/uds/v1/dbwwce/ping` | Blocked | Still returns HTTP 404 on 2026-07-07. |
| GraphQL CRUD | `/uds/v1/dbwwce/gateway` and UI Playground | Blocked | HTTP 404 from gateway endpoint; Playground returned `{ "error": "Error: [object Object]" }`. Reload succeeds but returns `data:false`, so CRUD cannot be proven until gateway activation works. |

## Identity And Security

| Area | UI Path | Result | Evidence |
| --- | --- | --- | --- |
| Authentication page | Services > Authentication | Verified | Tabs: API Docs, Logs, General, Client Credential, OIDC, SSO, External IdP. |
| OIDC client | Authentication > OIDC | Verified | Created dev client `Blocks Lab a5 Dev`; redirect `https://dbwwce-eeojx.seliseblocks.com/oidc`; OpenID scope. Secret/client values masked and not recorded. |
| IAM overview | Services > IAM | Verified | Tabs: Configure, Organizations, Users, Roles, Permissions, Signup Settings, Invite User. |
| Project people | Project > People | Verified | Owner `Alvi Ehsan`, email `alviehsan@live.com`, envs Development/Production. |
| Client credentials | Authentication > General + Client Credential | Verified partial | Enabled Client Credential and Authorization Code grant types in General. Created `Blocks Lab Report Client` with audience `https://dbwwce-eeojx.seliseblocks.com` and `user` role. Secret remained masked and was not copied or recorded. |
| MFA | Services > MFA | Verified | Email provider and Authenticator app provider both enabled successfully. This may require MFA during future lab logins. |
| Captcha | Services > Captcha | Verified | Added Google reCAPTCHA config with fake lab keys, enabled it, then disabled it to avoid breaking auth with invalid keys. Config remains present with masked keys. No CAPTCHA challenge was solved. |
| IAM organizations | Services > IAM > Organizations | Verified | Default organization exists and is Active; Add Organization button disabled until Configure Organization is used. |
| IAM users | Services > IAM > Users | Verified | Users table currently empty; Signup Settings and Invite User forms available. Invite form has first name, last name, email; no invite sent. |
| IAM roles | Services > IAM > Roles | Verified | Built-in `cloudadmin` has 73 permissions, `user` has 45. Created custom least-privilege role `Report Viewer` / `report_viewer` with 0 permissions. |
| IAM permissions | Services > IAM > Permissions | Verified | Permission severity overview shows Critical/High/Medium/Low counts; table lists built-in endpoint permissions with filters for Source, Severity, Type. |

## Observability

| Area | UI Path | Result | Evidence |
| --- | --- | --- | --- |
| Health dashboard | Observability > Health | Verified | All services/Blocks services/Deployed services/My services tabs; services showed 100% in table. |
| Tracing | Observability > Tracing | Verified | Hot/Cold/Archive/Guide/Ask AI; UDS requests visible. |
| Logs | Data Gateway > Logs | Verified | UDS API requests/traces visible. |
| Usage/quota | Observability > Usages | Untested | Need inspect. |
| App monitoring add | Deployment detail > Monitoring > Add | Untested | Need create or verify monitor config. |

## API And Service Surface Findings

| Area | Path | Result | Evidence |
| --- | --- | --- | --- |
| Service pings | API | Partial | `/idp/v1/ping`, `/identifier/v1/ping`, `/cloudbuild/v1/ping`, `/blocksai-api/v1/ping`, `/communication/v1/ping`, `/lmt/v1/ping` returned 200. Guessed `/authentication/v1/ping`, `/iam/v1/ping`, `/mfa/v1/ping`, `/captcha/v1/ping`, `/storage/v1/ping`, `/notification/v1/ping` returned 404. |
| Communication swagger | `/communication/v1/swagger/v1/swagger.json` | Verified | Exposes Mail, Notifier, and Template APIs: send mail, get mailbox mails, notify, notification read state, template save/get/clone/delete. |
| IDP swagger | `/idp/v1/swagger/v1/swagger.json` | Verified | Exposes 74 routes including OIDC clients, client credentials, authorization, token, users, MFA, and identity/access operations. |
| Storage/notification swagger guesses | `/storage/v1/swagger/v1/swagger.json`, `/notification/v1/swagger/v1/swagger.json` | Blocked | Both returned 404. Storage and notification UI exist; notification APIs are exposed under Communication swagger `Notifier/*`. |
| LMT swagger | `/lmt/v1/swagger/v1/swagger.json` | Verified partial | Exposes Log and Trace APIs with schemas. Schema-valid trace/log requests still returned 500 with trace ids, while UI Tracing/Health worked. |

## Remaining Console Areas

| Area | UI Path | Status | Notes |
| --- | --- | --- | --- |
| AI Agents | AI > Agents | Verified partial | General Assistant created, previewed, and published. Need more custom agent/model combinations. |
| AI Knowledge Base | AI > Knowledge Base | Verified partial | Folder and writeup created; writeup stayed pending with 0 chunks. File upload still blocked by browser automation upload support. |
| AI Tools | AI > Tools | Verified | Health tool and GET `/healthz` action created; debug succeeded. |
| AI Models | AI > Models | Verified partial | Model catalog and custom model form tested; fake custom model validation failed cleanly with dummy key. No real provider secret used. |
| Workflow | Workflow | Verified partial | Workflow created with webhook trigger; builder menus inspected. Need more multi-step workflows. |
| Storage | Services > Storage | Verified partial | Storage list shows provider cards. Add Configuration supports AWS, Azure, SFTP, and AWS S3 Compatible. Created fake AWS config `Blocks Lab Fake AWS`; UI accepted it but summarized provider cards as Azure/SFTP. Azure detail page exposes folders `Cloud` and `Construct`, grid/table view toggle, API Docs, and Logs. No real storage secrets used. |
| Language/UILM | Services > Language, `blocks uilm` | Untested | Need test language/glossary/translation commands and UI. |
| Email utility | Utilities > Email | Verified partial | Tabs: Templates, Incoming Mails, Outgoing Mails. Created template `ReportReadyLab`, configuration `Default`, language German, subject `Your lab report is ready`; Beefree iframe editor loaded and template saved. Incoming/Outgoing mail analytics empty with date/status filters. Did not send test email because that requires explicit recipient/action confirmation. |
| Notifications | Utilities > Notifications | Verified partial | Created configuration `ReportReadySignalR`, channel SignalR, type BroadcastReceiverType, notify method `report.ready`, persistence No. Did not send notification yet. |
| Magic URL | Utilities > Magic URL | Verified | Configured context/base URL, created `https://seli.cc/wgwuko`, verified HTTP 301 redirect to dev `/healthz`, and `curl -L` returned `ok`. |
| Settings | Project/settings screens | Untested | Need inspect non-destructive settings. |

## Localization Findings

| Area | Path | Result | Evidence |
| --- | --- | --- | --- |
| CLI UILM surface | `blocks uilm --help` and subcommand help | Verified partial | Commands exist: `add-key`, `translate-all`, `translate-language`, `translate-key`, `add-module`, `view-timeline`, `rollback`, `delete-key`, `lang-default`, `publish`; help does not expose usable flags. |
| Translation list | Language > Translation Keys | Verified | Tabs/buttons: API Docs, Logs, Configure, Translation Keys, History, Publish Changes, New Key, View, filters Modules/Missing Translations/Create Date/Last Update Date, search, pagination. |
| New module | New Key > Module dropdown > New Module | Verified | Created `report-lab`; module appeared in dropdown. |
| New module selection | New Key form | Partial | Newly created `report-lab` appeared but was not selectable into the current form; existing `common` module selected successfully. |
| New key | Language > New Key | Verified | Created `REPORT_BUILDER_TITLE` under `common`, with English `Report Builder`, German `Berichtsgenerator`, Bengali `রিপোর্ট নির্মাতা`. |
| Publish changes | Language > Publish Changes | Verified | Confirmation modal appeared; publish accepted and returned `File generation is in progress.` |

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
| AI Models catalog | AI > Models | Verified | Provider cards present: OpenAI, Anthropic, Gemini, DeepSeek, Mistral, Azure, OpenRouter, Custom Model. |
| Custom model form | AI > Models > Custom Model > Add Model | Verified | Fields: Model Name, API URL, API Key, API Version, Temperature, Maximum tokens, Custom Headers. API Key is effectively required before Save enables. |
| Custom model validation | Custom Model > Validate | Verified failure | Created `Blocks Lab Fake Model` with dummy key and lab URL; validation called endpoint and failed with `custom API error: LLM invocation failed` plus nginx `405 Not Allowed`. No real provider secret used. |
| Tool creation | AI > Tools > Add Tool | Verified | Created `Blocks Lab Health Tool` with base URL `https://dbwwce-eeojx.seliseblocks.com`, no auth. |
| Tool API action | Tool detail > API > Create API | Verified | Created GET `/healthz` action through 4-step wizard: Basic Information, Input Parameters, Output Parameters, Debugging. |
| Tool API debug | Create API > Debugging > Run Debug | Verified | Debug succeeded; response contained base64 `b2sK` for `ok\n`; action status became `Tested`. |

## Workflow Findings

| Area | UI Path | Result | Evidence |
| --- | --- | --- | --- |
| Workflow list | Workflow | Verified | Search, Status filter, Add Workflow, table columns Name/Creation date/Last updated/Status. |
| Workflow creation | Workflow > Add Workflow | Verified | Created `Lab Health Check Workflow`; editor opened at `/workflow/c74f0123e53649ff80dd1d678cecc9c0`. |
| Builder shell | Workflow detail > Editor | Verified | React Flow canvas with Editor, Executions, Active toggle, Logs, Save, zoom/fit controls. |
| Start trigger menu | Editor > Add first step | Verified | Options: Webhook, Email Trigger, Data Trigger, Blocks Schedule, Agent, Send Mail, HTTP Request, Data Action, If, Set Field (Coming soon). |
| Webhook trigger | Add first step > Webhook | Verified | Added Webhook start node and saved workflow; Last saved updated to `05/07/2026, 05:10 PM`. |
| Node toolbar | Webhook node hover toolbar | Partial | Toolbar buttons are icon-only. One icon deleted the node; workflow was rebuilt. Need identify edit/duplicate/add behaviors more safely. |
| Executions tab | Workflow detail > Executions | Partial | Shows `Select an execution to view details`; no manual Execute button visible for current one-node workflow. |
| Logs button | Workflow detail > Logs | Partial | No logs without a selected execution. |
| Workflow API | API probing | Blocked | No public swagger found at guessed workflow paths; observed UI traces mention `Workflow/GetAll`, but public routes returned 404. |
