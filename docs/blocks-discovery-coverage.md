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
| CLI auth persistence | `~/.blocks/auth.json` refresh-token flow | Verified | CLI frequently reports signed out after token expiry, but local refresh-token renewal restores auth without asking for a password or printing token values. |
| CLI deploy surface | `blocks --help`, subcommand help | Verified limitation | Installed CLI has no `deploy`, `build`, `repo`, `cloudbuild`, `workflow`, `ai`, `data-gateway`, `storage`, or `auth-config` command. Deployment is only possible through Blocks Cloud UI/API in this CLI version. |
| GitHub auth | `gh auth status` | Verified | Account `alviehsan`; repo/workflow scopes available. |
| GitHub repo | `git remote -v` / GitHub | Verified | `alviehsan/selise_blocks_lab_a5`. |
| Local app tests | `npm test -- --run` | Verified | 7 Vitest tests across 2 files passed on 2026-07-07 after the report scenario and Docker-context regression coverage was added. |
| Local app build | `npm run build` | Verified | Vite production build passed on 2026-07-07. |
| Report examples | App > Report Builder | Verified | Three selectable examples added: Ops Handoff, Gateway Readiness, AI Workflow. Each populates the draft and can be saved to localStorage. |
| Expanded report scenarios | App > Report Builder | Verified | Commit `c3d4c80` expanded the three report examples into progressively complex Blocks use cases with service coverage, acceptance checks, workflow plans, GDPR notes, and a workflow-friendly payload preview. Commit `44ab5ff` added a CloudBuild Docker-context regression test. Full local verification on 2026-07-07: `npm test -- --run` passed 7 tests across 2 files; `npm run build` succeeded. |

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
| Report examples deployment | GitHub push + CloudBuild | Verified | Commit `c9562ad` pushed to `main` and `dev`. Dev build `3d7c8105-aa74-4b52-a367-1fafe871f912` and prod build `f0d18308-d1b7-428a-8750-20b712113d37` succeeded. Dev/prod bundle `index-D3r-60nA.js` contains `Ops Handoff`, `Gateway Readiness`, and `AI Workflow`; `/healthz` returns `ok`. |
| Workflow JSON endpoint deployment | GitHub push + CloudBuild | Verified | Commit `08be6c1` added nginx `/workflow-health.json` for Workflow HTTP Request parsing. Dev build `e1c7b602-6835-4928-bf87-6cb5c941eb02` and prod build `2fde6c46-8be6-49ac-b35b-2dec2369c29d` succeeded. Dev/prod endpoint returns `{"ok":true,"service":"selise_blocks_lab_a5","workflowReady":true}`. |
| Expanded report app deployment | GitHub push + CloudBuild | Verified | Commit `c3d4c80` added richer scenario UI plus `/scenario-status.json` and `/gdpr-report.json`. First redeploy: prod build `62638464-1261-48ec-9898-ea7beaf733c4` succeeded, dev build `83e86255-2c8e-4270-9f27-ef331df6b056` failed. Root cause from dev build events: SAST created `.scannerwork` before Kaniko Docker build, and Kaniko failed resolving a transient Sonar temp license file under `.scannerwork/.sonartmp/...`. Fix: commit `44ab5ff` added `.scannerwork` to `.dockerignore` and a regression test. Redeploy after fix succeeded: dev build `65e5d7da-0659-4c6b-9830-cd90a23e1c44`, prod build `6dac82ef-ba44-4559-8d4f-0343226e383f`. |
| Expanded report endpoints | Dev/prod hosted domains | Verified | Dev and prod `/healthz`, `/workflow-health.json`, `/scenario-status.json`, and `/gdpr-report.json` all returned HTTP 200 after commit `44ab5ff`. Scenario endpoint reports `scenarioId: ai-workflow`, `complexity: 3`; GDPR endpoint reports `policy: owner-scoped-access`. |
| CloudBuild swagger | `/cloudbuild/v1/swagger/v1/swagger.json` | Verified | Swagger exposes AnalyticsTool, Auth, Build, Github, and VcsRepository groups. `/cloudbuild/v1/ping` returned `pong from blocks-cloudbuild-api`. |
| CloudBuild CI/CD API surface | `/cloudbuild/v1/*` | Verified | Read routes verified: `Auth/IsAuthorized`, `Github/user`, `Github/repos`, `Github/branches`, `Build/repos-list`, `Build/settings`, `Build/reports`, `VcsRepository/RepoList`, `RepoDetails`, and `HostingConfiguration`. Mutating routes exist for repo settings, webhook creation, and manual builds, but only manual build was used to avoid changing working deployment settings. |
| GitHub branch API | `/cloudbuild/v1/Github/branches` | Verified partial | Full repo name lookup returned `dev` and `main`, both at the current report commit. `GithubBranchExists` returned `Repository not found` for every tested repo identifier variant, so that endpoint appears inconsistent for this lab. |
| SAST reports | `/cloudbuild/v1/Build/reports?type=sast` | Verified | Dev/prod SAST report reads returned quality gate `ERROR`, coverage `0.0`, 17 code smells, and 2 security hotspots. Important nuance: CloudBuild deployment still succeeded despite SAST quality gate `ERROR`. Dependency-track report returned `data:null`. |

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
| Data source configure | Data Gateway > Configure + API | Partial | Correct routes are `/uds/v1/data-sources/{projectKey}/get` and `/uds/v1/data-sources/get?projectKey=...`. Data source exists with `projectShortKey: dbwwce`, database name and connection string present, but `isActive:false` remains. UI Configure > Blocks database > Update > Confirm completed without visible error. Swagger-valid `PUT /uds/v1/data-sources/update` using the existing returned connection/database values plus `isActive:true` returned 200/acknowledged with `totalImpactedData:0`; state did not change. |
| Import schema | Data Gateway > Import | Verified partial | Opens JSON-only upload dialog, max file 50 MB. Upload button stays disabled until a file is selected. No file import performed. |
| Playground | Data Gateway > Playground | Verified failure | Query editor, response editor, Schemas, Clean Test Data, Execute controls visible. Minimal query `query { __typename }` returned `{ "error": "Error: [object Object]" }`; Schemas panel says `No schema data available`. `Clean Test Data` was not pressed because it is destructive. |
| Gateway health | `/uds/v1/dbwwce/ping` | Blocked | Still returns HTTP 404 on 2026-07-07 after UI Configure update, swagger-valid reloads, and data-source update attempt. |
| GraphQL CRUD | `/uds/v1/dbwwce/gateway` and UI Playground | Blocked | HTTP 404 from gateway endpoint; UI Playground returns `{ "error": "Error: [object Object]" }`. Reload endpoints return `data:false`, deployment pipeline returns `400 Failed to initiate DataGateway pipeline`, so CRUD/RLS cannot be proven until gateway activation works. |
| Gateway comparison | Lab vs Brisk vs Recap | Verified | Lab `dbwwce` ping returns 404 and deployment pipeline returns `400 Failed to initiate DataGateway pipeline`. Brisk dev `dfqocj` ping returns 200 even though its data source also reports `isActive:false`, so `isActive:false` alone is not a gateway-health signal. Recap `dbokpj` ping returned 502. |
| Schema readback comparison | UDS schema APIs | Verified | Lab schema info reads returned existing collections including `InventoryItem`, `TaskManagerItem`, `InvoiceItem`, and `LabNote`; unadapted change logs were empty. Brisk schema info returned Brisk collections and also had empty unadapted logs. |
| GraphQL comparison | `/uds/v1/{shortKey}/gateway` | Verified limitation | Lab GraphQL returned HTTP 404. Brisk GraphQL returned HTTP 502 with the current global CLI header/token pairing, so Brisk CRUD was not used as proof against the lab; it likely needs project-specific service-token/header alignment. |

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
| Usage/quota | Observability > Usage (`/usages`) | Verified | Last Hour selector, Refresh, Ask AI, Global overview, and per-service API/Worker toggles. At verification time: 14 total API calls, 0.32s average response, 14 successes, 0 errors; service cards included Identity, Email, Unified Data Service, Notification, Localization, Deploy & Observe, AI Gateway. |
| LMT trace API | `POST /lmt/v1/Trace/GetTraces` | Verified | With a 3-day date filter and `projectKey`, returned HTTP 200, `totalCount: 94`, and recent traces including Workflow `GET Workflow/Get` and `PUT Workflow/Update` operations from `blocks-utilities-api`. |
| LMT log API | `POST /lmt/v1/Log/GetLogs` | Verified | With service `Unified Data Service`, 3-day date filter, and `projectKey`, returned HTTP 200 with `totalCount: 0`, not an API error. |
| LMT service analytics | `POST /lmt/v1/Trace/GetServiceAnalytics` | Verified | Returned HTTP 200 with 8 service analytics buckets including request totals, status class counts, duration, and throughput fields. |
| Deployment monitoring | Deployment (`/devops`) | Verified limitation | Deployment overview shows repo URL, deploy URL, custom deployment URL, status, latest deployment date, deployment type. The `Observibility` button/tab was present but disabled for the lab web app. |
| My Services | Observability > My Services (`/managed-services`) | Verified | Empty state shown: `No services found`. Available actions: Setup Guide and Register Service. No service was registered because that would require a real service contract/config. |

## API And Service Surface Findings

| Area | Path | Result | Evidence |
| --- | --- | --- | --- |
| Service pings | API | Partial | `/idp/v1/ping`, `/identifier/v1/ping`, `/cloudbuild/v1/ping`, `/blocksai-api/v1/ping`, `/communication/v1/ping`, `/lmt/v1/ping` returned 200. Guessed `/authentication/v1/ping`, `/iam/v1/ping`, `/mfa/v1/ping`, `/captcha/v1/ping`, `/storage/v1/ping`, `/notification/v1/ping` returned 404. |
| Communication swagger | `/communication/v1/swagger/v1/swagger.json` | Verified | Exposes Mail, Notifier, and Template APIs: send mail, get mailbox mails, notify, notification read state, template save/get/clone/delete. |
| IDP swagger | `/idp/v1/swagger/v1/swagger.json` | Verified | Exposes 74 routes including OIDC clients, client credentials, authorization, token, users, MFA, and identity/access operations. |
| Cloud configuration swagger | `/cloudconfiguration/v1/swagger/v1/swagger.json` | Verified | Exposes Authentication, Captcha, IAM, Mail, MFA, Notification, and Storage configuration APIs. Read endpoints for auth, IAM, MFA, captcha, mail, notification, and storage configuration all returned HTTP 200 with sensitive fields left masked/redacted in this report. |
| Storage/notification swagger guesses | `/storage/v1/swagger/v1/swagger.json`, `/notification/v1/swagger/v1/swagger.json` | Verified limitation | Both returned 404. Storage configuration APIs are under `/cloudconfiguration/v1/Storage/*`, storage file-manager APIs are under `/uds/v1/Files/*`, and notification APIs are under Communication swagger `Notifier/*` plus cloud configuration `Notification/*`. |
| LMT swagger | `/lmt/v1/swagger/v1/swagger.json` | Verified | Exposes Log and Trace APIs with schemas. Important detail: `GetLogs`, `GetTraces`, and analytics routes are `POST`, not `GET`. POST requests with `projectKey` and date filters returned traces, logs, and service analytics. |
| Blocks AI API constants | Console bundles + live API | Verified | Base `/blocksai-api/v1`; ping returns `{"status":"healthy","message":"pong"}`. Swagger guesses returned 404, but console bundles expose agent, KB, model, and tool endpoints. |
| Workflow API constants | Console bundles + live API | Verified | Workflow service is under `/utilities/v1/Workflow`. Exact read routes: `POST /GetAll`, `GET /Get`, `GET /GetExecutions`, `GET /GetExecution`. Webhook route shape: `/utilities/v1/Workflow/webhook/{projectKey}/{workflowId}/{nodeId}`. |
| UILM swagger | `/uilm/v1/swagger/v1/swagger.json` | Verified | Exposes 32 routes across Assistant, Config, Glossary, Key, Language, and Module. API surface is more complete than installed CLI help; `Key/Gets` is a `POST` with `GetKeysRequest`, while languages/modules/glossary/timeline/file-history reads are `GET`. |

## Remaining Console Areas

| Area | UI Path | Status | Notes |
| --- | --- | --- | --- |
| AI Agents | AI > Agents | Verified | Four agents now exist: `General Assistant`, `Report Ops Analyst`, `Report Workflow Reasoner`, and template-created `Enterprise Search Assistant`. All returned HTTP 200 through the working `query-lmt` route. `Report Ops Analyst` now has the lab KB folder and health tool attached and was republished, but normal chat still did not reliably use either attachment. Custom model integration was separately tested through AI Models and failed cleanly with a fake endpoint. |
| AI Knowledge Base | AI > Knowledge Base | Verified | Folder, text writeups, and Q&A created. Latest API readback shows 3 knowledge items in `Blocks Lab Notes`, all `embad_status: completed`, each with 1 chunk. File upload still blocked by browser automation upload support. |
| AI Tools | AI > Tools + `/blocksai-api/v1/tools/` | Verified | Health tool and GET `/healthz` action created; debug and `test-action` API succeeded. API list/detail/OpenAPI schema/summary/agent-count endpoints verified. Tool is `inactive`, has 1 tested action, 0 recorded summary calls, and 1 associated agent after attachment. |
| AI Models | AI > Models + `/blocksai-api/v1/agents/models` | Verified partial | Model catalog and custom model form tested; fake custom model validation failed cleanly with dummy key. API exposed 12 built-in agent models and provider seed catalogs, including OpenAI provider seed models. No real provider secret used. |
| Workflow | Workflow + `/utilities/v1/Workflow/*` | Verified | Workflow created with webhook trigger and HTTP Request action. Exact webhook API triggered execution. First run against plain-text `/healthz` failed JSON parsing; after adding `/workflow-health.json`, rerun completed successfully with Webhook and HTTP Request node status `4` and output `{ ok:true, service:"selise_blocks_lab_a5", workflowReady:true }`. |
| Storage | Services > Storage | Verified partial | Storage list shows provider cards. Add Configuration supports AWS, Azure, SFTP, and AWS S3 Compatible. Created fake AWS config `Blocks Lab Fake AWS`; UI accepted it but summarized provider cards as Azure/SFTP. Azure detail page exposes folders `Cloud` and `Construct`, grid/table view toggle, API Docs, and Logs. No real storage secrets used. |
| Language/UILM | Services > Language, `blocks uilm` | Verified partial | CLI command surface, UI translation key creation, module creation, and publish flow tested. CLI help does not expose usable non-interactive flags for the commands. |
| Email utility | Utilities > Email | Verified partial | Tabs: Templates, Incoming Mails, Outgoing Mails. Created template `ReportReadyLab`, configuration `Default`, language German, subject `Your lab report is ready`; Beefree iframe editor loaded and template saved. Incoming/Outgoing mail analytics empty with date/status filters. Did not send test email because that requires explicit recipient/action confirmation. |
| Notifications | Utilities > Notifications | Verified partial | Created configuration `ReportReadySignalR`, channel SignalR, type BroadcastReceiverType, notify method `report.ready`, persistence No. Did not send notification yet. |
| Magic URL | Utilities > Magic URL | Verified | Configured context/base URL, created `https://seli.cc/wgwuko`, verified HTTP 301 redirect to dev `/healthz`, and `curl -L` returned `ok`. |
| Settings | Project dashboard > Configure | Verified | Environment overview exposes Configure, Delete, repo domain controls, setup commands, and copy-code buttons. Configure dialog manages Application Domain and `Use a custom domain?`; no settings were changed. |

## Localization Findings

| Area | Path | Result | Evidence |
| --- | --- | --- | --- |
| CLI UILM surface | `blocks uilm --help` and subcommand help | Verified partial | Commands exist: `add-key`, `translate-all`, `translate-language`, `translate-key`, `add-module`, `view-timeline`, `rollback`, `delete-key`, `lang-default`, `publish`; every subcommand help only shows `-h, --help`, so non-interactive flags are not discoverable from CLI help. |
| Translation list | Language > Translation Keys | Verified | Tabs/buttons: API Docs, Logs, Configure, Translation Keys, History, Publish Changes, New Key, View, filters Modules/Missing Translations/Create Date/Last Update Date, search, pagination. |
| New module | New Key > Module dropdown > New Module | Verified | Created `report-lab`; module appeared in dropdown. |
| New module selection | New Key form | Partial | Newly created `report-lab` appeared but was not selectable into the current form; existing `common` module selected successfully. |
| New key | Language > New Key | Verified | Created `REPORT_BUILDER_TITLE` under `common`, with English `Report Builder`, German `Berichtsgenerator`, Bengali `রিপোর্ট নির্মাতা`. |
| Publish changes | Language > Publish Changes | Verified | Confirmation modal appeared; publish accepted and returned `File generation is in progress.` |
| Glossary | Language > Glossary | Verified | Created glossary item `Report SLA`, language English, type Full form, global context enabled, with context and notes. Success toast: `Glossary item created`; item appeared in the table. |
| UILM API reads | `/uilm/v1/*` | Verified | `Language/Gets` returned English, German, and Bengali; `Module/Gets` returned 17 modules including `common`; `Key/Gets` found `REPORT_BUILDER_TITLE`; `Glossary/Gets` reported one glossary item; language file generation history reported one generation; exported files reported zero. |

## Utility API Findings

| Area | API Path | Result | Evidence |
| --- | --- | --- | --- |
| Email templates | `GET /communication/v1/Template/Gets` | Verified | `PageNumber=0&PageSize=50&ProjectKey=...` returned HTTP 200, `totalCount: 7`, and 7 templates including the lab-created template. `PageNumber=1` returned `totalCount` but an empty page, so pagination appears zero-based for this route. |
| Mailboxes | `GET /communication/v1/Mail/GetMailBoxMails` | Verified | Incoming and outgoing mailbox reads returned HTTP 200, `isSuccess:true`, and `totalCount:0`. No mail was sent. |
| Notifications inbox | `GET /communication/v1/Notifier/GetNotifications` | Verified | Returned HTTP 200 with notifications, unread count, and total count. This is a global/user notification feed read; no notification was created through the send API. |
| Notification configuration | `GET /cloudconfiguration/v1/Notification/Gets` | Verified | Returned HTTP 200, `totalCount:1`, and the lab SignalR configuration metadata. |
| Mail configuration | `GET /cloudconfiguration/v1/Mail/Gets` | Verified | Returned HTTP 200 with the default mail configuration metadata. Password/secret fields were not printed or recorded. |
| Storage configuration | `GET /cloudconfiguration/v1/Storage/Gets` | Verified | Returned HTTP 200 and 2 storage configurations. Connection strings, access keys, secret keys, passwords, and similar fields were not printed or recorded. |
| Storage file listing | `POST /uds/v1/Files/GetDmsFileAndFolder` | Verified | Console bundle revealed storage file-manager routes under UDS: `GetDmsFileAndFolder`, `GetFile`, `GetFilesInfo`, `GetPreSignedUrlForUpload`, `UploadFile`, `UploadFileToLocalStorage`, `CreateFolder`, `DeleteFile`, `DeleteFolder`, and `updateFileAdditionalInfo`. Root list read returned HTTP 200. |
| Storage folder create | `POST /uds/v1/Files/CreateFolder` | Verified | Created disposable folder `Blocks Lab Report Folder 1783414459609` with Default storage config, required `fileStorageId`, typed metadata values, project key, and tags. Earlier invalid payloads proved `FileStorageId` and `MetaData[*].Value.Type` validation. Folder itemId `553f42e3-de0a-498e-ab13-f59e59955979` remains for audit; it was not deleted. |
| Storage file upload | `UploadFileToLocalStorage`, `GetPreSignedUrlForUpload` | Verified failure | Text upload to the folder returned HTTP 500 with trace id `0HNMQTGMDTLO7:00000003`; presigned upload URL request returned HTTP 500 with trace id `0HNMQTGMDTLO4:00000003`. `GetFilesInfo` returned existing file metadata with time-limited signed URLs, which were treated as sensitive and not recorded. |

## AI Findings

| Area | UI Path | Result | Evidence |
| --- | --- | --- | --- |
| Knowledge Base folder | AI > Knowledge Base > Add Folder | Verified | Created `Blocks Lab Notes` folder with default Blocks/Azure/Text Embedding ADA 002 model and Recursive chunking. |
| Knowledge Base tabs | Folder detail > Files/Links/Writeups/Q&A | Verified | All tabs load; each has add flow. File upload supports text/PDF only, max 5 files, 5 MB each. Browser automation could not attach file through this runtime. |
| Knowledge Base writeup | Folder detail > Writeups > Add Writeup + `/kb/text` | Verified | Created no-secret lab writeups. API route `POST /blocksai-api/v1/kb/text` accepts `project_key`, `folder_id`, `title`, and `text`, returns `Text is processing`, then embeds asynchronously. |
| Knowledge Base Q&A | Folder detail > Q&A + `/kb/qa` | Verified | API route `POST /blocksai-api/v1/kb/qa` accepts `project_key`, `folder_id`, `question`, and `answer`, returns `QA is processing`, then embeds asynchronously. Latest readback shows the Q&A completed with 1 chunk. |
| Knowledge Base API | `/blocksai-api/v1/kb/folders/list`, `/kb/knowledges`, `/kb/folder/agents` | Verified | Folder list response shape is `{ data: { folders } }`; folder id is `_id`. `/kb/knowledges` requires `folder_id` and returns items under `data.knowledge_bases`; project-only request returns `400 Bad Request: Folder ID is required.` Folder-agent association read returned 1 agent after attaching `Report Ops Analyst`. |
| Knowledge retrieval test | `/blocksai-api/v1/kb/retrieval-test/{agentId}` | Verified | Exact payload: `project_key`, `query`, `enable_query_enhancement`, `enable_rerank`, `top_k`, `score_threshold`, `ground_truth_texts`, `dense_weight`, `keyword_weight`. Test query for the workflow endpoint returned HTTP 200, `is_success:true`, 2 result groups, `analysis_data.enhanced_queries`, and `score_of_adequate_context`. Initial result had 2 docs and metrics `precision:0.2`, `recall:1`, `f1_score:0.333...`, `hit_rate:true`, `k:5`. |
| Agent creation | AI > Agents > Add Agent + `/agents/create` | Verified | Created `General Assistant` using predefined template, plus custom `Report Ops Analyst` and `Report Workflow Reasoner`. Template creation with `create_from:"enterprise_search_agent"` ignored the requested custom display name and created built-in `Enterprise Search Assistant`. |
| Agent preview | Agent detail > Preview | Verified | Sent `Reply with the word ready if you are active.`; agent replied `Ready`. |
| Agent publish | Agent detail > Publish | Verified | Publish returned `Agent published successfully`. |
| Agent configuration sections | Agent detail > Configuration | Verified | Sections present: LLM, Knowledge Base, Tools, Memory, Welcome Guide, Human Handoff (Coming Soon), Guardrails. |
| Agent API | `/blocksai-api/v1/agents/queries`, `/agents/query/{id}` | Verified | Agent list response shape is top-level `{ agents, total_count }`. Detail route returns LLM, RAG, memory, tool, KB, and guardrail configuration. Default model was `azure/gpt-4o-mini`; `enable_rag:true`, `enable_tools:false`, `kb_ids:[]`, `folder_ids:[]`, and `tool_ids:[]` for lab agents. |
| Agent query API | `/blocksai-api/v1/ai-agent/query-lmt` | Verified partial | Working route is `POST /blocksai-api/v1/ai-agent/query-lmt` with `project_key`, `agent_id` or `agentId`, `query`, and `session_id`. `/ai-agent/query` and trailing-slash variants returned 404. All four lab agents returned HTTP 200, with response shape `{ is_success, detail, query, response, response_timestamp, next_step_questions, session_id }`. After KB/tool attachment and republish, `Report Ops Analyst` still hallucinated the workflow endpoint and said the named health tool was unavailable; tool summary remained 0 calls. |
| Agent config update API | `/blocksai-api/v1/agents/update-ai-configurations` | Verified | Exact UI-derived payload for tool attachment: `agent_id`, `project_key`, current `rag_config`, current `llm_config`, current `guardrail`, `tool_ids`, and `enable_tools`. Exact KB attachment uses the same base plus `folder_ids` and `enable_rag`. Both returned HTTP 200 `Agent AI configuration updated successfully`; readback showed `enable_tools:true`, lab tool id present, `enable_rag:true`, lab folder id present. |
| AI Models catalog | AI > Models | Verified | Provider cards present: OpenAI, Anthropic, Gemini, DeepSeek, Mistral, Azure, OpenRouter, Custom Model. |
| AI provider catalog | `/blocksai-api/v1/models/seed/providers` | Verified | API returned 7 active provider seeds. `/models/seed/providers/OPENAI` returned 10 OpenAI seed models. `/models/` returned zero custom project models. `/agents/models` returned 12 built-in chat models. |
| Custom model form | AI > Models > Custom Model > Add Model | Verified | Fields: Model Name, API URL, API Key, API Version, Temperature, Maximum tokens, Custom Headers. API Key is effectively required before Save enables. |
| Custom model validation | Custom Model > Validate | Verified failure | Created `Blocks Lab Fake Model` with dummy key and lab URL; validation called endpoint and failed with `custom API error: LLM invocation failed` plus nginx `405 Not Allowed`. No real provider secret used. |
| Tool creation | AI > Tools > Add Tool | Verified | Created `Blocks Lab Health Tool` with base URL `https://dbwwce-eeojx.seliseblocks.com`, no auth. Tools list endpoint is `GET /blocksai-api/v1/tools/?page=1&page_size=20&project_key=...`; trailing slash matters. |
| Tool API action | Tool detail > API > Create API | Verified | Created GET `/healthz` action through 4-step wizard: Basic Information, Input Parameters, Output Parameters, Debugging. |
| Tool API debug | Create API > Debugging > Run Debug + `/tools/{toolId}/test-action/{actionId}` | Verified | Debug succeeded; response contained base64 `b2sK` for `ok\n`; action status became `Tested`. Retesting the action by API with body `{ project_key }` also returned HTTP 200 success. |
| Tool API readback | `/blocksai-api/v1/tools/{id}` and schema endpoints | Verified | Detail shows API base URL, `/healthz` action, `TestStatus:true`, no auth config, 30s timeout. `APIConfig.Actions` is an object keyed by action id, not an array. Generated OpenAPI schema exposes `/healthz` GET. Summary shows 0 total calls, so direct `test-action` and normal agent chat did not count as tool usage; agent-count endpoint returns 1 after attachment. |
| Tool arbitrary action test | `/blocksai-api/v1/tools/test-api-action` | Verified failure | Attempted no-auth GET `/scenario-status.json` with base URL, method, path, headers, query params, and body fields. Route returned HTTP 405 Method Not Allowed, so the exact ad-hoc test contract is still unknown. |

## Workflow Findings

| Area | UI Path | Result | Evidence |
| --- | --- | --- | --- |
| Workflow list | Workflow | Verified | Search, Status filter, Add Workflow, table columns Name/Creation date/Last updated/Status. |
| Workflow creation | Workflow > Add Workflow | Verified | Created `Lab Health Check Workflow`; editor opened at `/workflow/c74f0123e53649ff80dd1d678cecc9c0`. |
| Builder shell | Workflow detail > Editor | Verified | React Flow canvas with Editor, Executions, Active toggle, Logs, Save, zoom/fit controls. |
| Start trigger menu | Editor > Add first step | Verified | Options: Webhook, Email Trigger, Data Trigger, Blocks Schedule, Agent, Send Mail, HTTP Request, Data Action, If, Set Field (Coming soon). |
| Webhook trigger | Add first step > Webhook | Verified | Added Webhook start node and saved workflow; Last saved updated to `05/07/2026, 05:10 PM`. |
| HTTP Request step | Webhook node > plus > HTTP Request | Verified | Appended HTTP Request node to the workflow; workflow last saved updated to `07/07/2026, 01:01 AM`. Node settings show method default `GET`, URL field, send query/header/body toggles, input/output schema panels, and Execute Step. API readback confirmed URL first pointed to `/healthz`, then was updated to `/workflow-health.json`. |
| Workflow execution failure mode | Webhook API trigger -> `/healthz` | Verified | Exact webhook route accepted POST and queued execution. Webhook node completed, HTTP Request node failed with `System.Exception: 'o' is an invalid start of a value...` because `/healthz` returns plain text `ok`. |
| Workflow execution success | Webhook API trigger -> `/workflow-health.json` | Verified | Exact webhook route accepted POST and queued execution. Latest execution completed; Webhook and HTTP Request node executions both status `4`, error null. HTTP node output contained `{ ok:true, service:"selise_blocks_lab_a5", workflowReady:true }`. |
| Workflow scenario payload success | Webhook API trigger -> `/scenario-status.json` | Verified | Updated the existing workflow HTTP Request node to `https://dbwwce-eeojx.seliseblocks.com/scenario-status.json` through `PUT /utilities/v1/Workflow/Update`. First trigger attempt accidentally used the workflow id as node id and returned HTTP 500 with trace id; inspecting `Workflow/Get` showed the webhook node id is `aa2d94413c5d4ff689f4dc5e97da5fd2`. Triggering the exact webhook node returned HTTP 200. Execution `cd4b4aea6b434cc7b74bcd94bf3b6ad1` completed with status `4`, error null. HTTP Request node `650d614041424198a31709c561fe6a06` output included `scenarioId: ai-workflow`, `complexity: 3`, Blocks services, acceptance checks, workflow plan, and GDPR note. |
| Node toolbar | Webhook node hover toolbar | Partial | Toolbar buttons are icon-only. One icon deleted the node; workflow was rebuilt. Need identify edit/duplicate/add behaviors more safely. |
| Executions API | `/utilities/v1/Workflow/GetExecutions`, `/GetExecution` | Verified | Before webhook trigger, totalCount was 0. After two webhook runs, totalCount was 2; detail response includes workflow snapshot, node executions, items, input/output payloads, statuses, and error message. |
| Logs button | Workflow detail > Logs | Partial | UI Logs button visible. API execution detail now provides execution logs/data; browser tab was wedged by earlier Execute Step run before UI logs could be rechecked. |
| Workflow API | API probing | Verified partial | No public swagger/ping found at guessed workflow paths (`workflow`, `workflow-api`, `blocks-workflow`, `workflowengine`, `workflow-engine`, `orchestration`). Console bundle revealed working `/utilities/v1/Workflow/*` routes; read/update/webhook execution verified. |
| Workflow duplicate | `POST /utilities/v1/Workflow/Duplicate` | Verified | Required flat payload `{ workflowId, name, projectKey }`; wrong payloads returned validation errors for missing `name`, `workflowId`, and `dto`. Successful duplicate created `Lab Health Check Workflow Copy 1783414846593`, itemId `7fc09b6102e94b48a2bae9d24b11be40`, active by default. Triggering the copied webhook queued execution `3000a9e124cb44a19eed6f34e8b7c7e7`; detail status was `4`. |
| Workflow blank create and active toggle | `POST /Create`, `PUT /Update` | Verified | `Create` accepts flat `{ name, projectKey }` and creates an active blank workflow. Created `Lab Blank Workflow 1783414994335`, then used `Update` on that blank workflow only to rename it and set `isActive:false`; readback confirmed the inactive state. |
| Workflow read route details | `/utilities/v1/Workflow/*` | Verified | Exact details: `GetAll` is `POST`; `Get`, `GetExecutions`, and `GetExecution` are `GET`. Detail lookup requires `workflowId`, not `id`; execution detail requires `executionId`, not `id`. |
| Workflow node contracts | Console bundle | Verified | Node library supports Webhook, Email Trigger, Data Trigger, Blocks Schedule, Agent, Send Mail, HTTP Request, Data Action, If, and Set Field. Set Field is flagged `Coming Soon`. Toolbar dropdown Open works; Execute step, Rename, Copy, Duplicate, and dropdown Delete currently have no implementation in the bundle, while the icon delete button does remove nodes. |
| Agent workflow use case | Webhook -> Agent -> HTTP Request | Verified | Created `Lab Agent Report Workflow 1783415410338`, itemId `b80caa06f42b42a69d5581a3a5100b33`. Trigger execution `541ca03ebbf14756b024dbc1eb0c912b` completed with Webhook, Agent, and HTTP Request node status `4`; Agent output was passed into HTTP Request input, and HTTP output returned `/gdpr-report.json`. |
| Data Action workflow use case | Webhook -> Data Action | Verified failure | Created `Lab Data Action Workflow 1783415505288`, itemId `2074f434bcef4432b1ce8b3d0fb848a9`, configured Data Action `getData` against `LabNote`. Execution `eab35c73b0e34c96a17c03585e5e8ae5` queued successfully; Data Action node failed with `System.Exception: Response status code does not indicate success: 404 (Not Found).` This matches the lab UDS gateway 404 blocker. |
| If workflow use case | Webhook -> If -> two HTTP branches | Verified | Created `Lab If Branch Workflow 1783415539998`, itemId `669506b49231456daed18ceba60aef46`. Empty `conditions:[]` with `conditionType:"all"` completed; both HTTP branch node executions showed status `4`, but execution items only included webhook, If, and the true-branch HTTP output. Use explicit conditions before relying on branch semantics. |
| Schedule/Data trigger saved configs | Blocks Schedule, Data Trigger | Verified | Created inactive workflow `faee079ab59e48b280a706c9277946b8` with custom cron `0 0 9 * * *` and JSON payload; readback preserved parameters. Created inactive Data Trigger workflow `4766466b7d484727bea86525f0da1fa0` for `LabNote` `Inserted`; readback preserved collection and operation. |
| Email trigger dependency | Email Trigger | Blocked by configuration | Email Trigger requires an inbound mail configuration. Current mail configuration read returned zero inbound configs, so no Email Trigger workflow could be configured without adding a real inbound mail setup. |

## Final Report

### URLs And Identifiers

- Repository URL: https://github.com/alviehsan/selise_blocks_lab_a5
- Blocks project: `selise_blocks_lab_a5`
- Development environment itemId: `dd0e1af6-7571-4e69-b89d-cd62e1a38d7a`
- Production environment itemId: `6c7cb78d-253a-4a9a-b3c7-2f6b3e97a95d`
- Development domain: https://dbwwce-eeojx.seliseblocks.com
- Production domain: https://pbwwce-eeojx.seliseblocks.com
- Workflow id: `c74f0123e53649ff80dd1d678cecc9c0`
- Data Gateway schema: `LabNote`
- AI KB folder: `Blocks Lab Notes`
- AI tool: `Blocks Lab Health Tool`
- AI agent with KB/tool attachment: `Report Ops Analyst`

### What Worked

- Created and pushed a fresh public GitHub repo with `main` and `dev` branches.
- Created a deployed Vite web app with static routing and lab endpoints: `/healthz`, `/workflow-health.json`, `/scenario-status.json`, `/gdpr-report.json`.
- Attached GitHub repositories to Blocks dev/prod and deployed by CloudBuild API.
- Verified dev/prod domains and endpoint responses.
- Created OIDC/client-credential configuration, MFA settings, IAM role, localization key/glossary, email template, notification config, Magic URL, storage config readbacks, observability reads, Workflow, AI agents, KB content, AI tool, and retrieval testing.
- Workflow webhook and HTTP Request ran successfully against JSON endpoints.
- AI KB retrieval testing returned relevant chunks from the lab knowledge base.
- AI tool debug and `test-action` API successfully called the deployed health endpoint.
- CloudBuild swagger and CI/CD routes were mapped; branch listing, build settings, reports, repo details, and SAST report reads worked.
- Workflow create, duplicate, update/toggle, webhook trigger, execution list, and execution detail APIs were verified.
- Workflow Agent, Data Action, If, Blocks Schedule, and Data Trigger node contracts were created or executed to an end state where safely possible.
- Storage folder creation worked with typed metadata and a real Blocks storage configuration.

### Failed Or Unavailable

- Installed Blocks CLI `@seliseblocks/cli v0.0.35` has no deploy/build/repo/workflow/AI/Data Gateway management commands.
- Data Gateway gateway endpoint remains blocked: `/uds/v1/dbwwce/ping` and `/uds/v1/dbwwce/gateway` return 404; UI Playground returns `{ "error": "Error: [object Object]" }`.
- Data source remains `isActive:false` even after UI Configure, swagger-valid update, reload, and pipeline attempts.
- Direct GraphQL CRUD/RLS could not be proven until gateway activation works.
- Normal AI chat through `query-lmt` did not reliably use attached KB/tool even after configuration and republish; dedicated retrieval testing did work.
- Browser automation for file upload and some Workflow log/node-toolbar UI checks was unreliable in this runtime.
- Storage upload and presigned-upload routes returned HTTP 500 even though folder creation/listing worked.
- SAST quality gate reported `ERROR`, but CloudBuild still deployed successfully.
- Workflow Data Action failed because the lab UDS gateway returns 404; Email Trigger was blocked by absence of an inbound mail configuration.
- Email send, notification send, destructive data cleanup, invite user, and deletes were not executed because they require explicit side-effect approval.

### Deployment Reproduction

1. Push app changes to the expected branch: `main` for production, `dev` for development.
2. Refresh local Blocks auth if needed through the local CLI token cache without printing tokens.
3. List CloudBuild repos with `POST /cloudbuild/v1/Build/repos-list` using environment itemId as `ProjectKey`.
4. Trigger build with `POST /cloudbuild/v1/Build/run-build`; use repo itemId/sourceRepoId from the repo list.
5. Poll `GET /cloudbuild/v1/Build?buildId=...&ProjectKey=...` until `Succeeded` or a concrete failure.
6. Verify hosted endpoints with `curl -fsS` against dev/prod domains.

Important deployment detail: CloudBuild `ProjectKey` is the environment itemId, not the short slug.

### CLI Commands Used

```sh
blocks --help
blocks version
blocks auth
blocks projects
gh auth status
gh repo create alviehsan/selise_blocks_lab_a5 --public
git push -u origin main
git checkout -b dev
git push -u origin dev
npm test -- --run
npm run build
```

CloudBuild, Workflow, Data Gateway, AI, Communication, LMT, UILM, and cloud-configuration actions were performed through authenticated HTTPS API calls using local Blocks CLI auth and the configured public Blocks instance key. Secrets were not printed or stored in the repo.

### Browser Click Paths

- Console: `https://cloud.seliseblocks.com/console`
- Project environments: Project card > Development/Production.
- Deployment: sidebar `Deployment` / `/devops`.
- Data Gateway: sidebar `Data` > `Data Gateway`; Playground at `/services/data-gateway/playground`; Logs at `/services/data-gateway/logs`.
- Identity: sidebar `Identity` > Authentication, Access Manager, MFA, Captcha.
- Observability: sidebar `Observability` > Logs & Tracing, Health & Monitoring, Usage, My Services.
- AI: sidebar `AI` > Agents, Knowledge Base, Tools, Models.
- AI agent details: `/ai/agent-details/{agentId}/configuration`, `/retrieval-testing`, `/integrations`, `/conversations`.
- Workflow: sidebar `Workflow` > Add Workflow > Editor > add Webhook > add HTTP Request > Save > webhook API trigger > Executions.
- Localization: sidebar `Localization` > Translations, Glossary.
- Utilities: sidebar `Utilities` > Email, Notifications, Magic URL.
- Storage: sidebar `Data` > Storage.
- Settings: Project dashboard > Configure.

### Data Gateway/API Findings

- UDS swagger groups: Configuration, DataAccess, DataManage, DataSource, DataValidation, Deployment, Files, Schema, SchemaExchange.
- Created `LabNote` with `Title`, `Status`, `OwnerUserId`, `DueAt`.
- `Title` required validation and owner-scoped read/edit/delete policies were created.
- Correct data-source reads are `/uds/v1/data-sources/{projectKey}/get` and `/uds/v1/data-sources/get?projectKey=...`.
- `isActive:false` is not sufficient to diagnose gateway failure: Brisk dev pings successfully with the same data-source state, while the lab gateway returns 404 and its UDS pipeline returns 400.
- Gateway activation is the remaining blocker. Until `/uds/v1/dbwwce/ping` stops returning 404, GraphQL CRUD and RLS cannot be truthfully marked complete.
- UDS Files folder creation works only with `fileStorageId` and typed metadata values; file upload/presigned upload still fails with HTTP 500 in the lab.

### Brisk Recommendations

- Treat CloudBuild API deployment as the reliable automation path unless the installed Blocks CLI gains deploy/repo commands.
- Add `.scannerwork` to `.dockerignore` in real apps to avoid SAST/Kaniko Docker context failures.
- Do not treat a passing CloudBuild deployment as a passing quality gate; read SAST reports separately and decide whether to enforce them in release policy.
- Keep environment itemIds, repo itemIds, and branch mappings documented beside each Blocks environment.
- Verify Data Gateway activation before building app features on UDS; schema/policy creation alone is not enough.
- Use owner-scoped UDS policies with `CreatedBy == auth userId` for user-owned records, then prove RLS through live CRUD once gateway health works.
- Treat signed file URLs returned by storage APIs as sensitive, short-lived secrets; redact them from logs and reports.
- For AI, validate KB through retrieval testing separately from agent chat; attachment and publish do not guarantee chat will invoke RAG/tools.
- Avoid real provider secrets in early AI model tests; use dummy validation only until the integration contract is known.
- Keep side-effecting utilities such as email, notification, invite, file mutation, cleanup, and deletes behind explicit operator approval.
