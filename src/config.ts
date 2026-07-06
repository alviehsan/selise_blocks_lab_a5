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
  draft: ReportDraft;
};

export const reportScenarios: ReportScenario[] = [
  {
    id: "ops-handoff",
    name: "Ops Handoff",
    summary: "Deployment and health summary for a release handoff.",
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

function stringValue(value: string | boolean | undefined, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}
