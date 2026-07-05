import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { getRuntimeConfig, parseOidcCallback } from "./config";
import "./styles.css";

const config = getRuntimeConfig();

function App() {
  const [apiStatus, setApiStatus] = useState("Not checked");
  const [apiDetails, setApiDetails] = useState("");
  const callbackParams = useMemo(() => {
    if (window.location.pathname !== "/oidc") return null;
    return parseOidcCallback(window.location.href);
  }, []);

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
          <h2>API Reachability</h2>
          <p>{apiStatus}</p>
          {apiDetails ? <small>{apiDetails}</small> : null}
          <button onClick={checkApi}>Check Blocks API</button>
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
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
