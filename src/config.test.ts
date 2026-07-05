import { describe, expect, it } from "vitest";
import { getRuntimeConfig, parseOidcCallback } from "./config";

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
});
