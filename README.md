# SELISE Blocks Lab a5

Disposable SELISE Blocks discovery app for testing GitHub attachment, CloudBuild, domains, environment variables, static routing, OIDC callback routing, and Data Gateway/API reachability.

## Local Commands

```sh
npm install
npm test
npm run build
npm run dev
```

## Public Environment Variables

These values are safe for browser exposure and can be configured in Blocks environment settings:

```text
VITE_BLOCKS_ENVIRONMENT=dev
VITE_BLOCKS_PROJECT_SLUG=selise-blocks-lab-a5
VITE_BLOCKS_API_URL=https://api.seliseblocks.com
VITE_LAB_MESSAGE=Running from SELISE Blocks CloudBuild.
```

Do not commit passwords, client secrets, refresh tokens, personal access tokens, or API keys.

## Route Checks

- `/` verifies the deployed app shell.
- `/health` verifies static fallback routing.
- `/oidc?code=test&state=lab` verifies callback routing and redaction.
