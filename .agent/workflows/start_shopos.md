---
description: How to start the ShopOS application (Frontend + Backend)
---

# Startup Guide

Follow these steps to run ShopOS from a fresh terminal.

## 1. Backend Server
The backend handles data analysis and API requests.

```bash
cd packages/opencode
bun run dev -- serve
```

## 2. Frontend Application
The frontend is the web dashboard. Open a **new terminal tab** for this.

```bash
cd packages/app
bun --bun run dev
```

## Verification
- **Backend Health**: Open `http://localhost:4096/api/analysis/health` (Should see: "OK")
- **Dashboard**: Open `http://localhost:3000` (or the port shown in terminal)
