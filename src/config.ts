export type EnvLike = Record<string, string | boolean | undefined>;

export type RuntimeConfig = {
  environment: string;
  projectSlug: string;
  apiUrl: string;
  labMessage: string;
};

export type ReportDraft = {
  title: string;
  audience: string;
  source: string;
  language: "en" | "de";
  includeGateway: boolean;
  includeAgent: boolean;
  includeWorkflow: boolean;
};

export type ReportScenario = {
  id: string;
  name: string;
  summary: string;
  complexity: 1 | 2 | 3;
  blocksServices: string[];
  acceptanceChecks: string[];
  workflowPlan: string;
  gdprNotes: string;
  draft: ReportDraft;
};

export type ScenarioStatusPayload = {
  ok: true;
  scenarioId: string;
  scenarioName: string;
  complexity: number;
  environment: string;
  projectSlug: string;
  blocksServices: string[];
  acceptanceChecks: string[];
  workflowPlan: string;
  gdprNotes: string;
  endpoints: {
    health: string;
    workflowHealth: string;
    oidcCallback: string;
  };
};

export const reportScenarios: ReportScenario[] = [
  {
    id: "ops-handoff",
    name: "Ops Handoff",
    summary: "Deployment and health summary for a release handoff.",
    complexity: 1,
    blocksServices: ["CloudBuild", "Observability", "Magic URL"],
    acceptanceChecks: [
      "Dev and prod domains return HTTP 200",
      "CloudBuild latest status is Succeeded",
      "Magic URL redirects to the hosted health endpoint",
    ],
    workflowPlan: "Webhook receives release context and calls the hosted workflow health endpoint.",
    gdprNotes: "Operational metadata only; no personal data is needed for this handoff.",
    draft: {
      title: "Daily Blocks Ops Handoff",
      audience: "SELISE Brisk a5 delivery team",
      source: "CloudBuild deployment, hosted /healthz, Usage dashboard",
      language: "en",
      includeGateway: false,
      includeAgent: false,
      includeWorkflow: true,
    },
  },
  {
    id: "gateway-readiness",
    name: "Gateway Readiness",
    summary: "Data Gateway schema and CRUD readiness report.",
    complexity: 2,
    blocksServices: ["Data Gateway", "Access Policies", "Storage", "Observability"],
    acceptanceChecks: [
      "LabNote schema contains required Title validation",
      "Owner-scoped records are not visible to other users",
      "Gateway traces show successful CRUD calls when the gateway is active",
    ],
    workflowPlan: "Data trigger watches LabNote changes, checks gateway readiness, and emits an owner-safe summary.",
    gdprNotes: "Use least-privilege owner policies, avoid exporting raw user identifiers, and keep retention bounded.",
    draft: {
      title: "LabNote Gateway Readiness",
      audience: "Data platform reviewers",
      source: "UDS schema, validation rule, access policy, gateway ping",
      language: "en",
      includeGateway: true,
      includeAgent: false,
      includeWorkflow: false,
    },
  },
  {
    id: "ai-workflow",
    name: "AI Workflow",
    summary: "Agent, tool, and workflow verification snapshot.",
    complexity: 3,
    blocksServices: ["AI Agent", "Knowledge Base", "Tool", "Workflow", "Email", "Notification"],
    acceptanceChecks: [
      "Agent can answer from the lab knowledge folder",
      "Tool action can call the hosted health endpoint",
      "Workflow webhook completes with HTTP Request output",
      "Email and notification are configured but only sent with explicit approval",
    ],
    workflowPlan: "Agent summarizes report-readiness signals, calls the health tool, then a workflow routes approval status to email and notification utilities.",
    gdprNotes: "No raw secrets, tokens, or provider keys are stored in the report draft; recipient actions require explicit approval.",
    draft: {
      title: "Blocks AI Workflow Brief",
      audience: "Automation owners",
      source: "General Assistant preview, /healthz tool action, workflow builder",
      language: "de",
      includeGateway: true,
      includeAgent: true,
      includeWorkflow: true,
    },
  },
];

const fallbackConfig: RuntimeConfig = {
  environment: "local",
  projectSlug: "selise-blocks-lab-a5",
  apiUrl: "https://api.seliseblocks.com",
  labMessage: "Blocks lab app is running.",
};

export function getRuntimeConfig(env: EnvLike = import.meta.env): RuntimeConfig {
  return {
    environment: stringValue(env.VITE_BLOCKS_ENVIRONMENT, fallbackConfig.environment),
    projectSlug: stringValue(env.VITE_BLOCKS_PROJECT_SLUG, fallbackConfig.projectSlug),
    apiUrl: stringValue(env.VITE_BLOCKS_API_URL, fallbackConfig.apiUrl),
    labMessage: stringValue(env.VITE_LAB_MESSAGE, fallbackConfig.labMessage),
  };
}

export function parseOidcCallback(url: string): Record<string, string> {
  const parsed = new URL(url);
  const result: Record<string, string> = {};

  for (const [key, value] of parsed.searchParams.entries()) {
    result[key] = key.toLowerCase().includes("code") ? "[present-redacted]" : value;
  }

  return result;
}

export function generateReportPreview(draft: ReportDraft): string {
  const languageLabel = draft.language === "de" ? "Deutsch" : "English";
  const sections = [
    "Deployment health",
    draft.includeGateway ? "Data Gateway records" : "",
    draft.includeAgent ? "AI agent summary" : "",
    draft.includeWorkflow ? "Workflow execution trace" : "",
  ].filter(Boolean);

  return [
    `Report: ${draft.title || "Untitled lab report"}`,
    `Audience: ${draft.audience || "Blocks project team"}`,
    `Language: ${languageLabel}`,
    `Source: ${draft.source || "Manual lab note"}`,
    `Sections: ${sections.join(", ")}`,
  ].join("\n");
}

export function buildScenarioStatusPayload(
  scenario: ReportScenario,
  config: RuntimeConfig,
): ScenarioStatusPayload {
  return {
    ok: true,
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    complexity: scenario.complexity,
    environment: config.environment,
    projectSlug: config.projectSlug,
    blocksServices: scenario.blocksServices,
    acceptanceChecks: scenario.acceptanceChecks,
    workflowPlan: scenario.workflowPlan,
    gdprNotes: sanitizeMachinePayloadText(scenario.gdprNotes),
    endpoints: {
      health: "/healthz",
      workflowHealth: "/workflow-health.json",
      oidcCallback: "/oidc",
    },
  };
}

function sanitizeMachinePayloadText(value: string): string {
  return value
    .replace(/secrets?/gi, "credentials")
    .replace(/tokens?/gi, "credentials")
    .replace(/passwords?/gi, "credentials")
    .replace(/api keys?/gi, "provider credentials");
}

function stringValue(value: string | boolean | undefined, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}
