export type EnvLike = Record<string, string | boolean | undefined>;

export type RuntimeConfig = {
  environment: string;
  projectSlug: string;
  apiUrl: string;
  labMessage: string;
};

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

function stringValue(value: string | boolean | undefined, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}
