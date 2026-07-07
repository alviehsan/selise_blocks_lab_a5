import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  buildScenarioStatusPayload,
  generateReportPreview,
  getRuntimeConfig,
  parseOidcCallback,
  reportScenarios,
  type ReportDraft,
} from "./config";
import "./styles.css";

const config = getRuntimeConfig();
const savedReportsKey = "blocks-lab-reports";

const initialDraft: ReportDraft = {
  title: "Blocks Lab Health Report",
  audience: "SELISE Brisk a5 team",
  source: "Deployment, Data Gateway, AI Agent, Workflow",
  language: "en",
  includeGateway: true,
  includeAgent: true,
  includeWorkflow: true,
};

type SavedReport = ReportDraft & {
  id: string;
  createdAt: string;
  preview: string;
};

function readSavedReports(): SavedReport[] {
  try {
    const raw = window.localStorage.getItem(savedReportsKey);
    return raw ? (JSON.parse(raw) as SavedReport[]) : [];
  } catch {
    return [];
  }
}

function App() {
  const [apiStatus, setApiStatus] = useState("Not checked");
  const [apiDetails, setApiDetails] = useState("");
  const [healthStatus, setHealthStatus] = useState("Not checked");
  const [gatewayStatus, setGatewayStatus] = useState("Not checked");
  const [draft, setDraft] = useState<ReportDraft>(initialDraft);
  const [activeScenarioId, setActiveScenarioId] = useState(reportScenarios[0].id);
  const [reports, setReports] = useState<SavedReport[]>(readSavedReports);
  const activeScenario =
    reportScenarios.find((scenario) => scenario.id === activeScenarioId) ?? reportScenarios[0];
  const scenarioPayload = useMemo(
    () => buildScenarioStatusPayload(activeScenario, config),
    [activeScenario],
  );
  const callbackParams = useMemo(() => {
    if (window.location.pathname !== "/oidc") return null;
    return parseOidcCallback(window.location.href);
  }, []);
  const reportPreview = useMemo(() => generateReportPreview(draft), [draft]);

  async function checkApi() {
    setApiStatus("Checking...");
    setApiDetails("");

    try {
      const response = await fetch(`${config.apiUrl}/uds/v1/swagger/v1/swagger.json`, {
        headers: { accept: "application/json" },
      });
      setApiStatus(response.ok ? "Reachable" : `HTTP ${response.status}`);
      setApiDetails(response.ok ? "UDS Swagger JSON responded." : response.statusText);
    } catch (error) {
      setApiStatus("Request failed");
      setApiDetails(error instanceof Error ? error.message : "Unknown error");
    }
  }

  async function checkHealth() {
    setHealthStatus("Checking...");
    try {
      const response = await fetch("/healthz");
      setHealthStatus(response.ok ? "Healthy" : `HTTP ${response.status}`);
    } catch (error) {
      setHealthStatus(error instanceof Error ? error.message : "Request failed");
    }
  }

  async function checkGateway() {
    setGatewayStatus("Checking...");
    try {
      const response = await fetch(`${config.apiUrl}/uds/v1/${config.projectSlug}/ping`, {
        headers: { accept: "application/json" },
      });
      setGatewayStatus(response.ok ? "Gateway reachable" : `HTTP ${response.status}`);
    } catch (error) {
      setGatewayStatus(error instanceof Error ? error.message : "Request failed");
    }
  }

  function saveReport() {
    const nextReport: SavedReport = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      preview: reportPreview,
    };
    const nextReports = [nextReport, ...reports].slice(0, 6);
    window.localStorage.setItem(savedReportsKey, JSON.stringify(nextReports));
    setReports(nextReports);
  }

  function updateDraft<K extends keyof ReportDraft>(key: K, value: ReportDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">SELISE Blocks discovery app</p>
          <h1>Blocks Lab a5</h1>
          <p>{config.labMessage}</p>
        </div>
        <div className="statusPanel" aria-label="Runtime status">
          <span>{config.environment}</span>
          <strong>{config.projectSlug}</strong>
        </div>
      </section>

      <section className="grid">
        <article>
          <h2>Runtime Environment</h2>
          <dl>
            <dt>Environment</dt>
            <dd>{config.environment}</dd>
            <dt>API URL</dt>
            <dd>{config.apiUrl}</dd>
            <dt>Route</dt>
            <dd>{window.location.pathname}</dd>
          </dl>
        </article>

        <article>
          <h2>Deployment Health</h2>
          <p>{healthStatus}</p>
          <button onClick={checkHealth}>Check /healthz</button>
        </article>

        <article>
          <h2>API Reachability</h2>
          <p>{apiStatus}</p>
          {apiDetails ? <small>{apiDetails}</small> : null}
          <button onClick={checkApi}>Check Blocks API</button>
        </article>

        <article>
          <h2>Data Gateway Probe</h2>
          <p>{gatewayStatus}</p>
          <small>Uses the public gateway ping route for the active project slug.</small>
          <button onClick={checkGateway}>Check Gateway Ping</button>
        </article>

        <article>
          <h2>OIDC Callback Probe</h2>
          {callbackParams ? (
            <pre>{JSON.stringify(callbackParams, null, 2)}</pre>
          ) : (
            <p>Open <code>/oidc?code=test&amp;state=lab</code> to test callback routing.</p>
          )}
        </article>

        <article>
          <h2>Static Routing</h2>
          <p>This single page app renders the active path for deployment route checks.</p>
          <a href="/health">Open /health</a>
        </article>
      </section>

      <section className="workspace">
        <div className="panel">
          <h2>Report Builder</h2>
          <div className="scenarioGrid" aria-label="Report scenarios">
            {reportScenarios.map((scenario) => (
              <button
                className="scenarioButton"
                key={scenario.id}
                onClick={() => {
                  setActiveScenarioId(scenario.id);
                  setDraft(scenario.draft);
                }}
                data-active={scenario.id === activeScenarioId}
              >
                <span>{scenario.name}</span>
                <small>{scenario.summary}</small>
              </button>
            ))}
          </div>
          <div className="scenarioDetails">
            <div>
              <h3>Blocks Services</h3>
              <ul>
                {activeScenario.blocksServices.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Acceptance Checks</h3>
              <ul>
                {activeScenario.acceptanceChecks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Workflow Plan</h3>
              <p>{activeScenario.workflowPlan}</p>
            </div>
            <div>
              <h3>GDPR Notes</h3>
              <p>{activeScenario.gdprNotes}</p>
            </div>
          </div>
          <label>
            Title
            <input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} />
          </label>
          <label>
            Audience
            <input value={draft.audience} onChange={(event) => updateDraft("audience", event.target.value)} />
          </label>
          <label>
            Source
            <textarea value={draft.source} onChange={(event) => updateDraft("source", event.target.value)} />
          </label>
          <div className="controlRow">
            <label>
              Language
              <select
                value={draft.language}
                onChange={(event) => updateDraft("language", event.target.value as ReportDraft["language"])}
              >
                <option value="en">EN</option>
                <option value="de">DE</option>
              </select>
            </label>
            <label className="check">
              <input
                checked={draft.includeGateway}
                type="checkbox"
                onChange={(event) => updateDraft("includeGateway", event.target.checked)}
              />
              Data
            </label>
            <label className="check">
              <input
                checked={draft.includeAgent}
                type="checkbox"
                onChange={(event) => updateDraft("includeAgent", event.target.checked)}
              />
              Agent
            </label>
            <label className="check">
              <input
                checked={draft.includeWorkflow}
                type="checkbox"
                onChange={(event) => updateDraft("includeWorkflow", event.target.checked)}
              />
              Workflow
            </label>
          </div>
          <button onClick={saveReport}>Save Report Draft</button>
        </div>

        <div className="panel">
          <h2>Generated Preview</h2>
          <pre>{reportPreview}</pre>
          <h2>Workflow Payload</h2>
          <pre>{JSON.stringify(scenarioPayload, null, 2)}</pre>
          <h2>Saved Drafts</h2>
          {reports.length ? (
            <ul className="reportList">
              {reports.map((report) => (
                <li key={report.id}>
                  <strong>{report.title}</strong>
                  <small>{new Date(report.createdAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No saved drafts yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
