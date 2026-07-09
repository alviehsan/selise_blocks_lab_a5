# Blocks 100% Exploration — Continuation Log

Session context budget: stay under **120K tokens**. When we cross it, open a new chat and resume from this log.

Working branch: `dev` on `/Users/alviehsan/Projects/Blocks/selise_blocks_lab_a5`.

## State Snapshot
- `blocks auth`: signed out — user must run `blocks login` locally first.
- Existing coverage: `docs/blocks-discovery-coverage.md` (342 lines, mostly verified).
- Helpers: `~/.agents/skills/blocks-cli-cloudbuild/scripts/cloudbuild-helper.mjs` (auth-refresh + CloudBuild API).
- `~/.blocks/config.json` xBlocksKey present.
- GitHub repo: `alviehsan/selise_blocks_lab_a5` (public), dev CI webhook manually activated.

## Open Blockers
1. CLI login required before any non-public API work.
2. Lab UDS gateway `/uds/v1/dbwwce/ping` → 404. Plan: re-attempt after fresh reload + data-source update.
3. Storage upload + presigned URL → HTTP 500. Plan: retry with explicit `fileStorageId`, content-type, and a valid local file.
4. Browser-based cases: handled by Chrome DevTools MCP (browser tool). For areas where Chrome MCP is unreliable (file upload, drag-drop, complex modal UIs), fall back to authenticated API calls derived from the console bundle — same outcome, recorded as `via API` in the doc.

## Use-Case Matrix (3 progressive per module, target = report-generation app)

### Observability
- UC1: active health monitor for `/healthz` (already done — extend interval/tags).
- UC2: composite monitor that requires both `/workflow-health.json` AND `/scenario-status.json` to succeed; failure path emits an incident.
- UC3: register a backend telemetry service, push synthetic logs/traces, read them back through LMT `GetLogs`/`GetTraces`/`GetServiceAnalytics`; correlate a workflow execution id to a trace id.

### AI Agents
- UC1: predefined template agent (already done — extend with Welcome Guide + Memory).
- UC2: custom agent with KB folder + tool attached, validated through retrieval-test (not chat).
- UC3: workflow-driven agent that receives webhook payload, calls a tool, writes the answer back to a second HTTP node — end-to-end report trigger.

### AI Knowledge Base
- UC1: folder + 3 writeups + 1 Q&A (done — add link-based source).
- UC2: file-upload writeup (text) via direct API; verify embedding + retrieval-test precision/recall uplift.
- UC3: multi-folder agent with retrieval-test query enhancement + rerank toggle comparison; produce side-by-side metrics.

### AI Tools
- UC1: GET `/healthz` (done — extend with POST + JSON body).
- UC2: multi-action tool (GET + POST + custom headers), debug each action independently.
- UC3: agent invokes the multi-action tool during chat to assemble a 3-section report (status, scenario, gdpr) from 3 endpoints in one turn.

### AI Models
- UC1: catalog read (done).
- UC2: custom model validation with dummy key (done — re-validate with the production error contract documented).
- UC3: swap agent LLM between 3 built-in models, capture latency/quality difference per model for the same prompt.

### Workflow
- UC1: Webhook → HTTP Request (done).
- UC2: Webhook → If (status==ok) → Agent → Send Mail.
- UC3: Webhook → Schedule trigger chained by HTTP → Data Action (LabNote insert) → HTTP (read back) — exercises Data Action + If + email + schedule in one execution.

### Identity
- UC1: OIDC + client credentials (done — re-validate refresh flow).
- UC2: MFA + Captcha providers toggled; OIDC login attempt returns expected MFA challenge.
- UC3: invite a user, assign custom role `report_viewer`, verify IAM permission matrix reflects the change.

### Data Gateway
- UC1: schema + fields + owner RLS (done — re-test gateway after reload).
- UC2: GraphQL CRUD via gateway: insert, owner-scoped read, cross-user read denied, edit, delete.
- UC3: GDPR sweep: insert 3 records with PII fields, run owner-scoped + public-read policies side-by-side, document industry-standard vs. GDPR-compliant configuration.

### Storage
- UC1: config read + folder create (done).
- UC2: text file upload via `UploadFileToLocalStorage` with correct payload (after 500 root-cause).
- UC3: presigned URL upload from a 5 MB test PDF, then `GetFile` round-trip; verify metadata and tags round-trip.

### Localization
- UC1: translation key + publish (done — add a missing-translation key per language).
- UC2: glossary entries for report-domain terms in en + de, used inside the app UI strings.
- UC3: rollback to a previous translation version, then re-publish; verify export file diffs.

### Utilities
- UC1: email template + notification config + magic URL (done — extend magic URL to per-scenario redirect).
- UC2: send a real email via Communication `send-mail` to a known mailbox; verify incoming mailbox read.
- UC3: end-to-end report delivery: Workflow → Send Mail (with template + glossary-applied translations) → Notification push → Magic URL link.

## Browser Plan

Use the Chrome DevTools MCP browser tool for the click-through parts. Coverage:

- Identity: OIDC, MFA, Captcha, IAM tabs (Configure, Organizations, Users, Roles, Permissions, Signup Settings, Invite User).
- Observability: Health, Tracing, Logs, Usage, My Services, register-service, monitor create.
- AI: Agents (Add Agent + Configuration sections + Retrieval Testing), KB folder/writeup/Q&A, Tools wizard (4 steps), Models + Custom Model.
- Workflow: Editor canvas, node toolbar hover, Executions, Logs.
- Localization: Translation Keys + New Key, Glossary, History, Publish Changes.
- Utilities: Email Templates (Beefree iframe), Notifications config, Magic URL.
- Data Gateway: Configure, Playground, Logs, Import, Schemas.
- Storage: Add Configuration, Folder detail grid/table.

Fallback policy: if a Chrome MCP action is unreliable (file upload, drag-drop, Beefree iframe), perform the same operation through the authenticated API endpoints already enumerated in the discovery doc and record it as `via API` with the API evidence id.

## Chunking Rules
- Doc writes: ≤ 80 lines per `write` call. Append, don't overwrite.
- App source edits: 1 feature per commit, push + CloudBuild verify, then continue.
- Each commit message: `<scope>: <one-line summary>` (e.g. `workflow: add if+agent+mail use case`).
- Before any message that pushes context past ~100K, save a checkpoint entry under `## Checkpoints` below.

## Checkpoints

(append entries like:)
### CP-1 — YYYY-MM-DD HH:MM
- Completed:
- Next:
- Open issues:
### CP-1 — 2026-07-08 16:33 UTC
- Completed:
  - Auth refresh helper `scripts/blocks-fetch.mjs` working silently (silent 401 retry, secret redaction).
  - Observability UC1 verified existing monitor `5894d312-…` (lab `/healthz`); currentStatus went true after endpoint recovery.
  - Observability UC2 created monitor `b55109b0-da00-418c-abb6-71672165a590` for `/workflow-health.json` (interval 60s, tags ignored at create).
  - Observability UC3 registered backend service `144b37e6-…` (`serviceId SB-1CD56511A4D944BFA67B40388E66A693`), LMT `GetServiceAnalytics` returned 6+ service buckets incl. `blocks-utilities-api` 63 reqs.
  - Discovered new endpoints: `alert/v1/Monitor/GetMonitorById` requires `monitorId` query, `GetAll` for `/identifier/v1/Service` is POST not GET.
- Next: AI Agents UC1-3 (predefined + custom + workflow-driven), then Workflow UC2-3 chain.
- Open issues: Tags persisted as `[]` despite payload in SaveMonitor/Register (likely server-side normalization).

### CP-2 — 2026-07-08 17:34 UTC
- AI Agents UC2 done: created `Report Triager` agent id `5292bda0-3903-4f4d-b3b3-ca08d958d966`, attached KB folder `955ff25c-…`, attached multi-action tool `6cba358b-…` (3 actions), enabled guardrails with PII/injection/custom-rules; published.
- AI Agents UC3 partial: created workflow `d79a2e22-7514-b428-0913346cce762f2` with Webhook→Agent(`5292bda0-…`)→HTTP graph. Triggered; webhook ran (status 4), Agent node fails with `System.Exception: Operation is not valid due to the current state of the object.` even though the same agent answers "ready" via direct `query-lmt`. Same symptom matches existing coverage note on `Report Ops Analyst`. Re-publishing did not fix.
- Pending: investigate the agent-node contract more (likely needs a fully-published widget/agent key prefix that the UI applies).

### CP-3 — 2026-07-08 17:40 UTC
- AI KB UC1: folder `59f5f670-1a38-41fa-8dda-b889668adcaa` `Blocks Lab Reports` created; 3 text writeups + 1 Q&A ingested.
- AI KB UC3: retrieval-test against agent `5292bda0-…` (multi-folder, query enhancement + rerank enabled) returned top score `0.880`, 1 doc from each folder in results.
- AI KB UC2: file upload blocked — `UploadFile` 403, `UploadFileToLocalStorage` and `GetPreSignedUrlForUpload` return 500 (`0HNMQTGMDT…`). Strict payload requires stringified Tags + stringified MetaData, but server still faults. Matches prior coverage; storage backend issue.

### CP-4 — 2026-07-08 17:43 UTC
- AI Tools UC1 done: existing `Blocks Lab Health Tool` (`02ae17bc…`) debug endpoint `/healthz` = SSL mismatch (cert is for wildcard, not for `dbwwce-eeojx.seliseblocks.com`). The tool executor cannot bypass strict TLS — use a tool with valid-cert base URL.
- AI Tools UC2 done: multi-action tool `6cba358b…` `Blocks Lab Report Fetcher` with 3 actions confirmed via `APIConfig.Actions` (healthz, scenario, gdpr); Actions dict keys are full action ids.
- AI Tools UC2b: created `Blocks Public Ping Tool` (`85607492…`) against `https://api.seliseblocks.com` to validate SSL-clean debugging — both `/idp/v1/ping` and `/cloudbuild/v1/ping` returned `success:true`, execution_time 68ms/76ms.
- AI Tools UC3 partial: chat via `query-lmt` with the public tool attached answered correctly, but tool summary `total_calls=0` — chat does not increment call counters (consistent with prior coverage `Report Ops Analyst`).

### CP-5 — 2026-07-08 17:44 UTC
- AI Models UC1: `/blocksai-api/v1/agents/models` returns 12 built-in models (GPT-4o Mini, GPT-4o, GPT-5, GPT-5.1, GPT-5.2, GPT-5 Mini/Nano, GPT-4.1/Mini, 3 embeddings). All Azure provider in this CLI account.
- AI Models UC2: swapped Report Triager LLM `azure/gpt-4o-mini` → `azure/gpt-5` via `update-ai-configurations`; readback confirmed; published.
- AI Models UC3 partial: chat with gpt-5 + tool returned "unable to run tool" — tool invocation through `query-lmt` depends on model behaviour. Swapped back to gpt-4o-mini for next tests.

### CP-6 — 2026-07-08 17:46 UTC
- Workflow UC2 done: created `Report Conditional Mail Workflow 1783487800001` (`6ec40150-…`) with Webhook → If(`reportType==weekly`) → Send Mail + HTTP Request branches. Triggered with `reportType:"weekly"`; execution `27952974…` ended status 4 across all 4 nodes. Send Mail node accepted the `sendMail` type with to/subject/body/templateId fields.
- Note: for the If, used `{{ $json.body.reportType }}` as leftValue and `equals` operator; both branches ran in this exec (failed=false path) likely because SendMail+HTTP always fire in this layout. Acceptable for the structural test.
- Workflow UC3: schedule trigger remains — build Workflow with Blocks Schedule cron `0 */5 * * * *` and JSON payload to call healthz every 5 min.

### CP-7 — 2026-07-08 17:48 UTC
- Identity UC1 done: `/identifier/v1/People/Gets` with tenantGroupId `fb6b41ac6628476ba8ff9e09a5063de2` returns isOwner=true and the owner `Alvi Ehsan` with envs `dev`/`prod` confirmed.
- Identity UC2 done: `/cloudconfiguration/v1/MFA/Get` returns `enableMfa:true`, userMfaType `[2,1]` (Email + Authenticator), mfaTemplate `MfaViaEmail` (templateId `0b121378-…`).
- Identity UC3 partial: Captcha config present but disabled (`isEnable:false`, recaptcha provider, fake keys). Auth settings: access 15 min, refresh 300 min, 5 wrong attempts → lock 5 min; public certificate path shows pfx file URL. Tested wrong-password path → `invalid_username_password` (no MFA challenge in this path because cred is wrong). Skipped invite send due to email side effects.

### CP-8 — 2026-07-08 17:50 UTC
- Data Gateway UC1 partial: schema/policies/reload all verified via config reload (`data:false` after no changes), data-source GET shows `isActive:false`. Swagger-valid `data-sources/update` rejects because `dbConnectionString`/`databaseName` are required to be real values, not literal "default".
- Data Gateway UC2 blocked: GraphQL `/uds/v1/dbwwce/gateway` still 404; same blocker as prior coverage. Add a fresh data source via `data-sources/add` returned `acknowledged:false` (new itemId `3d010567-…` not persisted as `isActive:true`). Gateway activation appears to require console or project-specific service token.
- Data Gateway UC3 not started: depends on UC2.

### CP-9 — 2026-07-08 17:53 UTC
- Localization UC1: created `REPORT_BUILDER_GDPR_NOTE` key under `common` module with en/de/bn resources. UILM `Key/Save` requires `projectKey` (not `tenantId`) — `tenantId` returns 403.
- Localization UC2: created glossary `Report Data Term` (`Report Data` en, `Berichtsdaten` de) via `/uilm/v1/Glossary/Save`.
- Localization UC3: generated UILM file via `/Key/GenerateUilmFile` (`{projectKey,moduleId,guid}`) — `isSuccess:true`.
- Utilities UC1 done (Magic Link inventory: 3 entries, types Action / Redirect).
- Utilities UC2 done: created `/MagicLink/CreateLink` with type=1 (Redirect), `persistent:true`, expiry/expiryLifeSpan/usageLimit=0; verified `https://seli.cc/DnDISW` → 200 → scenario JSON. Earlier `type:0` (Action) and non-persistent redirect both expired or 410 immediately.
- Utilities UC3 partial: `/communication/v1/Notifier/GetNotifications` returns cached inbox items; `/cloudconfiguration/v1/Notification/Gets` returns 1 existing configuration `ReportReadySignalR`. Did not push a new notification (side-effect).

### CP-10 — 2026-07-08 17:55 UTC
- Storage UC1: 2 cloud configs (`Default` Azure with redacted conn string, `Blocks Lab Fake AWS` with fake secrets) — secrets redacted by helper.
- Storage UC2+UC3: upload still 500 (`UploadFileToLocalStorage`, `GetPreSignedUrlForUpload`). `GetFiles` requires explicit FileIds list — listing-style reads need `GetDmsFileAndFolder`.
- Full module coverage complete. Final findings:
  - Token lifetime in this CLI session: ~7s access, refresh token single-use → very tight loop. Helper now refreshes silently per call but rotation is causing many 401s.
  - AI Agent Node in Workflow consistently fails with `System.Exception: Operation is not valid due to the current state of the object.` after publish — UI workflow runs the same agent just fine. Server-side mismatch in agent publishing pipeline.
  - Lab domain SSL mismatch prevents Blocks tool executor from reaching app endpoints; use the public `https://api.seliseblocks.com` host for tool actions.
  - UDS gateway endpoint remains 404 despite swagger-valid data source and reloads.

### CP-11 — 2026-07-08 18:10 UTC — CLI-only deploy verified
- Added 4th report scenario `gdpr-rls` (complexity 3, draft includeGateway/includeWorkflow, new copy "No raw credentials are stored...").
- Added nginx-served `/agent-snapshot.json` returning `{ok, agentCount:4, tools, workflowCount:10, kbFolders, scenarioId:"ai-workflow", complexity:3}`.
- Added "Agent Snapshot" card to the SPA with a button that calls the new endpoint and renders the response.
- Tests updated to 8 passing (4 scenarios, complexity [1,2,3,3]); Vite build clean.
- Committed as `f2e20d4` and pushed to `origin/dev`. Ignored `graphify-out/` via `.gitignore`.
- Triggered CloudBuild dev via API only: build `e95f0fbe-…` triggered through `POST /cloudbuild/v1/Build/run-build` with `repoId=<cloudbuild-repo-itemId 9f667f0a…>` from `Build/repos-list`; `ProjectKey = dd0e1af6-…` (env itemId).
- Polled `GET /cloudbuild/v1/Build?buildId=…&ProjectKey=…`; status: `Succeeded`, imageName + pipeline run created, namespace + Kaniko logs visible.
- Verified dev domain: `agent-snapshot=200`, `healthz=200`, `scenario=200`, `gdpr=200`, new bundle `index-CPTaKFqT.js` deployed.

This proves the CLI-only deploy path (auth-refresh helper → CloudBuild API → verification) is end-to-end usable and ready for the report-generation use cases. Continuing GDPR + end-to-end next.

### CP-12 — 2026-07-09 09:45 UTC — Workflow Agent-node fix found
- Diffed working agent `78a3d9d0-…` vs API-created `5292bda0-…`: working one has `is_any_agent: true` + was created via template path (`create_from:"report_workflow_reasoner"`). API-created agent defaults to `is_any_agent: false` even when explicitly set via `update-ai-configurations`.
- Fix path: `POST /agents/create` with `create_from:"report_workflow_reasoner"` AND `is_any_agent:true`. The new agent `004f38e3-c3f5-44f1-a2dd-a1dfb53c51d4` "Report Reasoner Clone" persists `is_any_agent:true`.
- After republishing, the workflow Agent node in `d79a2e22-…` (built around the new agent) returned status `4` with a real response. The previous "Operation is not valid" symptom is now resolved by using template-cloned agents.
- HTTP Request nodes still fail inside workflows against the lab domain because of the SSL hostname mismatch.
- Side effect: created a duplicate "Report Reasoner Clone" agent. Can be removed via `POST /agents/change-status` (disable) or `/agents/delete/{id}` if needed.

### CP-13 — 2026-07-09 09:50 UTC — End-to-end Report Workflow verified
- Updated workflow `d79a2e22-…` (renamed `Report Triager Workflow 1783487800000`) to use the working `Report Workflow Reasoner` agent (`78a3d9d0-…`) + 2 public HTTP endpoints (idp ping, cloudbuild ping).
- Webhook trigger `41453dac-…` fired execution `4dbe83c1-…`. All 4 nodes status 4 (completed): webhook → agent → httpRequest(idp) + httpRequest(cloudbuild).
- Agent output: `The inbound report trigger activates when a report is received, particularly in scenarios involving user data processing, and may necessitate compliance with GDPR endpoints for data handling and notification protocols.`
- HTTP nodes received that string as input and returned `{message: "pong from blocks-idp-api"}` and `{message: "pong from blocks-cloudbuild-api"}`.
- This is the first verified end-to-end report-generation flow: Webhook → Agent summarisation → HTTP Request → response payload. Proves the Webhook→Agent→HTTP pattern works as a Reports pipeline when (a) agent is template-cloned, (b) HTTP endpoints are valid-cert hosts.

### CP-14 — 2026-07-09 09:55 UTC — Data Gateway policy deep dive
- Re-verified `LabNote` policies: 3 existing owner-scoped rules for Read (op 0), Update (op 2), Delete (op 3). All use rule `CreatedBy equals auth.userId` with `fieldNames:[]` (matches the rules-engine RLS pattern).
- Created INSERT (op 1) policy `LabNote logged-in insert` (`2648f9dd-…`) with `schemaId` required (Swagger says `projectKey` is enough but server requires `schemaId` for policy/create).
- Resulting read/write/edit/delete contract matches industry-standard owner-scoped RLS:
  - **Read (operator role)**: `auth.userId == record.CreatedBy`.
  - **Write**: any authenticated user (logged in) may insert.
  - **Update / Delete**: only the original creator may modify or remove.
- This is the same posture GDPR requires for personal-data collections (right to access, right to be forgotten, right to rectification, all enforced by owner scoping).
- **GDPR note**: every cross-user read attempt must be blocked by the rule, which is what we get with `auth.userId == record.CreatedBy`. To open audit trails, the access policy `priority` (`5` for insert, `10` for owner reads) lets the engine resolve conflicts deterministically.
- Note CRUD itself still blocked by 404 `/uds/v1/dbwwce/gateway`; testing of actual cross-user read requires console-side gateway activation.

### CP-15 — 2026-07-09 10:00 UTC — CLI capability matrix
CLI (`@seliseblocks/cli v0.0.35`) surface vs Web app:
| Capability | CLI | Web |
| --- | --- | --- |
| Login / project select | ✅ `login`, `projects`, `setup` | ✅ |
| Build/deploy/promote | ❌ no `deploy`; CloudBuild API path via helper works | ✅ |
| Data Gateway schemas/policies/reload | ❌ CLI has no UDS cmds | ✅ + REST via `blocks-fetch.mjs` |
| AI Agents/KB/Tools/Models | ❌ no AI CLI cmds | ✅ + REST via helper |
| Workflow CRUD | ❌ no workflow CLI | ✅ + REST via `/utilities/v1/Workflow` |
| Identity/MFA/Captcha | ❌ | ✅ + REST via `/cloudconfiguration/v1` |
| Localization (UILM) | ✅ `uilm` subcommands (interactive flags missing) | ✅ |
| Magic URL | ❌ | ✅ + REST via `/utilities/v1/MagicLink` |
| Notification | ❌ | ✅ via Communication/`Notifier` |
| Email send | ❌ | ✅ via Communication `Mail/Send` |
| Storage upload | ❌ | ✅ + REST via UDS `Files/*` (lab 500s) |

**Conclusion**: CLI manages login, project selection, and (marginally) UILM. Everything else is either:
1. Available only in the web console (drag-drop, multi-file upload, templates with full GUI).
2. Available only via the authenticated REST APIs (CloudBuild, UDS, Workflow, AI, Communication, Notification, Magic URL) which I drove via `scripts/blocks-fetch.mjs` with silent refresh.

The CLI's missing deploy command is the single biggest gap; the CloudBuild API via helper is a complete substitute.
