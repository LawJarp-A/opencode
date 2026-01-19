# Implementation Plan - Deploy ShopOS to GCP

The goal is to deploy the ShopOS application (Frontend + Backend) to a Google Cloud Platform (GCP) instance.
Currently, the application has hardcoded `localhost` references and CORS configurations that prevent it from working in a remote environment.

## User Review Required
> [!IMPORTANT]
> **Domain & SSL**: This plan assumes deployment to a VM with a public IP. For a proper production setup, you should configure a domain name (e.g., `shopos.yourdomain.com`) and set up SSL (HTTPS). I will provide a basic Nginx configuration that can be extended for SSL (e.g., using Certbot).
>
> **Authentication**: The backend currently supports Basic Auth. You should set strong credentials in the `.env` file for production.

## Proposed Changes

### Backend (`packages/opencode`)

#### [MODIFY] [server.ts](file:///Users/gg/Documents/ShopOS/packages/opencode/src/server/server.ts)
- Update `Server.url()` to read from `process.env.OPENCODE_SERVER_URL` or similar.
- Update CORS configuration to allow origins specified in `process.env.OPENCODE_CORS_ALLOWED_ORIGINS` (comma-separated).

#### [NEW] [Dockerfile.backend](file:///Users/gg/Documents/ShopOS/packages/opencode/Dockerfile)
- Create a Dockerfile to build and run the backend service using Bun.

### Frontend (`packages/app`)

#### [MODIFY] [app.tsx](file:///Users/gg/Documents/ShopOS/packages/app/src/app.tsx)
- Ensure `ServerProvider` uses `import.meta.env.VITE_API_URL` as the `defaultUrl`.

#### [NEW] [Dockerfile.frontend](file:///Users/gg/Documents/ShopOS/packages/app/Dockerfile)
- Create a Dockerfile to build the Vite app and serve it using Nginx.
- Configure Nginx to proxy API requests to the backend if needed, or just serve static files.

### Infrastructure / Development

#### [NEW] [docker-compose.yml](file:///Users/gg/Documents/ShopOS/docker-compose.yml)
- Orchestrate Frontend and Backend containers.
- Expose Frontend on port 80 (or 443).
- Expose Backend on port 4096 (or internal only if proxied).

#### [NEW] [.env.production.example](file:///Users/gg/Documents/ShopOS/.env.production.example)
- Template for production environment variables.

### Documentation

#### [NEW] [DEPLOY.md](file:///Users/gg/Documents/ShopOS/DEPLOY.md)
- Step-by-step guide to:
    1.  Provision GCP VM.
    2.  Install Docker.
    3.  Clone repo & setup `.env`.
    4.  Run deployment.

## Verification Plan

### Automated Tests
- Run `bun test` in `packages/opencode` to ensure no regression.
- Run `bun typecheck` to ensure type safety.

### Manual Verification
1.  **Local Docker Test**:
    -   Run `docker-compose up` locally.
    -   Access Frontend at `http://localhost:80`.
    -   Verify it connects to Backend (`http://localhost:4096`).
2.  **Deployment steps**:
    -   I will verify the `docker-compose build` completes successfully.
