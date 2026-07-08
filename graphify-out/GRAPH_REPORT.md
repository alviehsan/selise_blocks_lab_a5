# Graph Report - selise_blocks_lab_a5  (2026-07-08)

## Corpus Check
- 8 files · ~8,854 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 73 nodes · 100 edges · 9 communities (7 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Blocks Platform Services
- Community 1
- Deployment & SAST
- React App + Runtime
- Community 4
- Community 5
- Data Gateway Surfaces
- Community 7
- Community 8

## God Nodes (most connected - your core abstractions)
1. `AI Workflow Scenario` - 10 edges
2. `App()` - 7 edges
3. `scripts` - 5 edges
4. `vite` - 5 edges
5. `buildScenarioStatusPayload()` - 5 edges
6. `vitest` - 4 edges
7. `getRuntimeConfig()` - 4 edges
8. `parseOidcCallback()` - 4 edges
9. `generateReportPreview()` - 4 edges
10. `Data Gateway (UDS)` - 4 edges

## Surprising Connections (you probably didn't know these)
- `@vitejs/plugin-react` --compiles--> `App()`  [EXTRACTED]
  package.json → src/main.tsx
- `AI Workflow Scenario` --references--> `AI Agent`  [EXTRACTED]
  selise_blocks_lab_a5/src/config.ts → selise_blocks_lab_a5/docs/blocks-discovery-coverage.md
- `AI Workflow Scenario` --references--> `AI Knowledge Base`  [EXTRACTED]
  selise_blocks_lab_a5/src/config.ts → selise_blocks_lab_a5/docs/blocks-discovery-coverage.md
- `AI Workflow Scenario` --references--> `AI Tool`  [EXTRACTED]
  selise_blocks_lab_a5/src/config.ts → selise_blocks_lab_a5/docs/blocks-discovery-coverage.md
- `AI Workflow Scenario` --references--> `Email Utility`  [EXTRACTED]
  selise_blocks_lab_a5/src/config.ts → selise_blocks_lab_a5/docs/blocks-discovery-coverage.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Lab Discovery Probe Loop** — concept_cloudbuild, concept_data_gateway, concept_ai_agent, concept_workflow [INFERRED 0.85]
- **Report Scenario Set** — scenario_ops_handoff, scenario_gateway_readiness, scenario_ai_workflow [EXTRACTED 1.00]
- **Docker Build to Serve Pipeline** — docker_build_stage, docker_nginx_stage, endpoint_healthz, endpoint_workflow_health, endpoint_scenario_status, endpoint_gdpr_report [EXTRACTED 1.00]

## Communities (9 total, 2 thin omitted)

### Community 0 - "Blocks Platform Services"
Cohesion: 0.12
Nodes (17): AI Agent, AI Knowledge Base, AI Tool, Email Utility, GDPR Policy, Health Monitor, IAM (Identity & Access), UILM Localization (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.24
Nodes (10): devDependencies, typescript, vite, @vitejs/plugin-react, vitest, scripts, build, dev (+2 more)

### Community 2 - "Deployment & SAST"
Cohesion: 0.22
Nodes (9): Blocks CLI v0.0.35, CloudBuild, .dockerignore SAST fix, Magic URL, My Services, Observability (LMT), SAST Quality Gate, Docker build stage (+1 more)

### Community 3 - "React App + Runtime"
Cohesion: 0.31
Nodes (8): react, parseOidcCallback(), ReportDraft, App(), config, initialDraft, readSavedReports(), SavedReport

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (7): EnvLike, fallbackConfig, getRuntimeConfig(), ReportScenario, RuntimeConfig, ScenarioStatusPayload, stringValue()

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (6): dependencies, react-dom, name, private, type, version

### Community 6 - "Data Gateway Surfaces"
Cohesion: 0.40
Nodes (4): Data Gateway (UDS), Owner-scoped RLS Policy, Storage (UDS Files), Gateway Readiness Scenario

## Knowledge Gaps
- **24 isolated node(s):** `name`, `version`, `private`, `type`, `EnvLike` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 1` to `Community 5`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `vite` connect `Community 1` to `React App + Runtime`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Blocks Platform Services` be split into smaller, more focused modules?**
  _Cohesion score 0.12418300653594772 - nodes in this community are weakly interconnected._