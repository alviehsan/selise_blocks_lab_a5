#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const home = os.homedir();
const configPath = path.join(home, ".blocks", "config.json");
const authPath = path.join(home, ".blocks", "auth.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

function safeHeaders(value) {
  if (!value) return undefined;
  if (value.length <= 8) return `${value.slice(0, 2)}***`;
  return `${value.slice(0, 4)}...${value.slice(-4)} (${value.length})`;
}

function redact(value, depth = 0) {
  if (depth > 4) return value;
  if (value == null) return value;
  if (typeof value === "string") {
    if (/token|password|secret|key|authorization|refresh|access/i.test(value) && value.length > 12) {
      return `${value.slice(0, 4)}***(${value.length})`;
    }
    return value;
  }
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (/token|password|secret|key|authorization|refresh/i.test(k) && typeof v === "string" && v.length > 12) {
        out[k] = `${v.slice(0, 4)}***(${v.length})`;
      } else {
        out[k] = redact(v, depth + 1);
      }
    }
    return out;
  }
  return value;
}

async function refreshAuth(config, auth) {
  const now = Date.now();
  const stillFresh =
    auth?.accessToken &&
    auth?.issuedAt &&
    auth?.expiresIn &&
    now < auth.issuedAt + Math.max(1, auth.expiresIn - 30) * 1000;
  if (stillFresh) return auth;

  if (!auth?.refreshToken) {
    const err = new Error("NO_AUTH");
    err.code = "NO_AUTH";
    throw err;
  }

  const body = new URLSearchParams();
  body.append("grant_type", "refresh_token");
  body.append("refresh_token", auth.refreshToken);

  const response = await fetch(`${config.apiBaseUrl}/idp/v1/Authentication/Token`, {
    method: "POST",
    headers: {
      "x-blocks-key": config.xBlocksKey,
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
    },
    body,
  });

  const text = await response.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }

  if (!response.ok || !json.access_token) {
    const err = new Error(`REFRESH_FAILED:${response.status}`);
    err.code = "REFRESH_FAILED";
    err.detail = redact(json);
    throw err;
  }

  const fresh = {
    accessToken: json.access_token,
    refreshToken: json.refresh_token || auth.refreshToken,
    expiresIn: json.expires_in,
    tokenType: json.token_type || "Bearer",
    issuedAt: Date.now(),
    sessionExpired: false,
  };
  writeJson(authPath, fresh);
  return fresh;
}

async function ensureAuth() {
  const config = readJson(configPath);
  let auth = {};
  if (fs.existsSync(authPath)) auth = readJson(authPath);
  try {
    auth = await refreshAuth(config, auth);
  } catch (e) {
    if (e.code === "NO_AUTH" || e.code === "REFRESH_FAILED") {
      console.error(JSON.stringify({ error: e.code, hint: "Run: blocks login" }));
      process.exit(2);
    }
    throw e;
  }
  return { config, auth };
}

async function blocksFetch(config, auth, route, options = {}, { retries = 2 } = {}) {
  const url = route.startsWith("http") ? route : `${config.apiBaseUrl}${route}`;
  const headers = {
    "x-blocks-key": config.xBlocksKey,
    authorization: `Bearer ${auth.accessToken}`,
    accept: "application/json",
    ...(options.body ? { "content-type": "application/json" } : {}),
    ...(options.headers || {}),
  };
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, { ...options, headers });
    const text = await response.text();
    let json;
    try { json = JSON.parse(text); } catch { json = text; }
    if (response.status === 401 && attempt < retries) {
      const fresh = JSON.parse(fs.readFileSync(authPath, "utf8"));
      auth = await refreshAuth(config, fresh);
      headers.authorization = `Bearer ${auth.accessToken}`;
      continue;
    }
    return { status: response.status, json, redacted: redact(json) };
  }
  throw new Error("unreachable");
}

function projectKey(config) {
  return config.activeProjectDetails?.tenantId || config.activeProject;
}

function print(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

async function cmdPing() {
  const { config, auth } = await ensureAuth();
  const r = await blocksFetch(config, auth, "/idp/v1/ping");
  print({ status: r.status, ping: r.redacted });
}

async function cmdFetch(method, route, bodyFile) {
  const { config, auth } = await ensureAuth();
  let body;
  if (bodyFile) body = JSON.parse(fs.readFileSync(bodyFile, "utf8"));
  const opts = { method };
  if (body) opts.body = JSON.stringify(body);
  const r = await blocksFetch(config, auth, route, opts);
  print({ route, status: r.status, data: r.redacted });
}

async function cmdUseProject(slug) {
  const { config, auth } = await ensureAuth();
  const r = await blocksFetch(config, auth, `/iam/v1/projects?search=${encodeURIComponent(slug)}`);
  print({ status: r.status, projects: r.redacted });
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === "ping") return cmdPing();
  if (cmd === "get") return cmdFetch("GET", rest[0]);
  if (cmd === "post") return cmdFetch("POST", rest[0], rest[1]);
  if (cmd === "put") return cmdFetch("PUT", rest[0], rest[1]);
  if (cmd === "delete") return cmdFetch("DELETE", rest[0], rest[1]);
  if (cmd === "use-project") return cmdUseProject(rest[0]);
  console.error("Usage: blocks-fetch.mjs <ping|get|post|put|delete|use-project> [route|slug] [body.json]");
  process.exit(2);
}

main().catch((e) => {
  console.error(JSON.stringify({ error: e.message, detail: e.detail }));
  process.exit(1);
});