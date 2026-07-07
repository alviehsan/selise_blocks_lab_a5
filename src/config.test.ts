import { describe, expect, it } from "vitest";
import {
  buildScenarioStatusPayload,
  generateReportPreview,
  getRuntimeConfig,
  parseOidcCallback,
  reportScenarios,
} from "./config";

describe("runtime config", () => {
  it("maps Vite environment values into public runtime fields", () => {
    const config = getRuntimeConfig({
      VITE_BLOCKS_ENVIRONMENT: "dev",
      VITE_BLOCKS_PROJECT_SLUG: "lab-slug",
      VITE_BLOCKS_API_URL: "https://api.seliseblocks.com",
      VITE_LAB_MESSAGE: "hello blocks",
    });

    expect(config).toEqual({
      environment: "dev",
      projectSlug: "lab-slug",
      apiUrl: "https://api.seliseblocks.com",
      labMessage: "hello blocks",
    });
  });

  it("redacts oauth callback secrets while preserving non-secret fields", () => {
    const result = parseOidcCallback(
      "https://example.test/oidc?code=secret-code&state=abc&session_state=xyz",
    );

    expect(result).toEqual({
      code: "[present-redacted]",
      state: "abc",
      session_state: "xyz",
    });
  });

  it("generates report previews with selected Blocks sections", () => {
    const preview = generateReportPreview({
      title: "Daily Ops",
      audience: "Brisk team",
      source: "Gateway and workflow",
      language: "de",
      includeGateway: true,
      includeAgent: false,
      includeWorkflow: true,
    });

    expect(preview).toContain("Report: Daily Ops");
    expect(preview).toContain("Language: Deutsch");
    expect(preview).toContain("Data Gateway records");
    expect(preview).toContain("Workflow execution trace");
    expect(preview).not.toContain("AI agent summary");
  });

  it("ships three report-generation examples for Blocks discovery", () => {
    expect(reportScenarios).toHaveLength(3);
    expect(reportScenarios.map((scenario) => scenario.id)).toEqual([
      "ops-handoff",
      "gateway-readiness",
      "ai-workflow",
    ]);
    expect(generateReportPreview(reportScenarios[2].draft)).toContain("AI agent summary");
  });

  it("models progressively richer report-generation use cases", () => {
    expect(reportScenarios.map((scenario) => scenario.complexity)).toEqual([1, 2, 3]);
    expect(reportScenarios[0].blocksServices).toEqual(["CloudBuild", "Observability", "Magic URL"]);
    expect(reportScenarios[1].acceptanceChecks).toContain("Owner-scoped records are not visible to other users");
    expect(reportScenarios[2].workflowPlan).toContain("Agent summarizes report-readiness signals");
    expect(reportScenarios[2].gdprNotes).toContain("No raw secrets, tokens, or provider keys are stored in the report draft");
  });

  it("builds a redacted workflow-friendly scenario status payload", () => {
    const payload = buildScenarioStatusPayload(reportScenarios[2], {
      environment: "dev",
      projectSlug: "dbwwce",
      apiUrl: "https://api.seliseblocks.com",
      labMessage: "hello",
    });

    expect(payload.ok).toBe(true);
    expect(payload.scenarioId).toBe("ai-workflow");
    expect(payload.blocksServices).toContain("Workflow");
    expect(payload.endpoints.health).toBe("/healthz");
    expect(JSON.stringify(payload)).not.toMatch(/secret|token|password|api key/i);
  });
});
