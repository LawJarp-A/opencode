# OpenCode Application Architecture Map
**Application running on: localhost:3000**

This document provides a comprehensive mapping of all files and directories that power the OpenCode web application, categorized by their architectural role.

---

## 1. Frontend Layer (UI & Client-Side Logic)

### 1.1 Main Application Package (`packages/app/`)
**Primary entry point for the web UI running on localhost:3000**

#### Core Entry Files
- `/packages/app/index.html` - HTML entry point, app shell
- `/packages/app/src/entry.tsx` - SolidJS application bootstrap
- `/packages/app/src/app.tsx` - Root application component
- `/packages/app/src/index.ts` - Main export module
- `/packages/app/package.json` - Frontend dependencies and scripts

#### Pages (Route Components)
- `/packages/app/src/pages/layout.tsx` - Root layout wrapper (49KB - complex routing logic)
- `/packages/app/src/pages/home.tsx` - Landing page with action selection
- `/packages/app/src/pages/session.tsx` - Main session/execution page (64KB - core UX flow)
- `/packages/app/src/pages/error.tsx` - Error boundary and handling
- `/packages/app/src/pages/directory-layout.tsx` - Directory structure view

#### UI Components (`packages/app/src/components/`)

**Dashboard Components** (`components/dashboard/`)
- `/packages/app/src/components/dashboard/action-dashboard.tsx` - Main orchestration UI (3-column results layout)
- `/packages/app/src/components/dashboard/action-card.tsx` - Action selection cards
- `/packages/app/src/components/dashboard/progress-tracker.tsx` - Live execution progress display
- `/packages/app/src/components/dashboard/results-view.tsx` - Result rendering logic

**Session Components** (`components/session/`)
- `/packages/app/src/components/session/session-new-view.tsx` - New session initialization
- `/packages/app/src/components/session/*` - Additional session management components (8 files)

**Dialog Components**
- `/packages/app/src/components/dialog-connect-provider.tsx` - Provider connection modal
- `/packages/app/src/components/dialog-edit-project.tsx` - Project editing
- `/packages/app/src/components/dialog-fork.tsx` - Project forking
- `/packages/app/src/components/dialog-manage-models.tsx` - Model management
- `/packages/app/src/components/dialog-select-directory.tsx` - Directory picker
- `/packages/app/src/components/dialog-select-file.tsx` - File picker
- `/packages/app/src/components/dialog-select-mcp.tsx` - MCP server selection
- `/packages/app/src/components/dialog-select-model.tsx` - Model selection
- `/packages/app/src/components/dialog-select-model-unpaid.tsx` - Unpaid model warning
- `/packages/app/src/components/dialog-select-provider.tsx` - Provider selection
- `/packages/app/src/components/dialog-select-server.tsx` - Server selection (8KB)

**Core Input Components**
- `/packages/app/src/components/prompt-input.tsx` - Main prompt input with context chips (65KB - complex component)
- `/packages/app/src/components/terminal.tsx` - Terminal emulator component (8KB)
- `/packages/app/src/components/file-tree.tsx` - File system tree view
- `/packages/app/src/components/link.tsx` - Custom link component

**Indicators**
- `/packages/app/src/components/session-context-usage.tsx` - Context usage meter
- `/packages/app/src/components/session-lsp-indicator.tsx` - LSP status indicator
- `/packages/app/src/components/session-mcp-indicator.tsx` - MCP status indicator

#### Context Providers (`packages/app/src/context/`)
State management and global context:
- `/packages/app/src/context/*` - 17 context providers for global state

#### Utilities & Hooks (`packages/app/src/`)
- `/packages/app/src/utils/*` - 9 utility modules
- `/packages/app/src/hooks/*` - Custom React-like hooks
- `/packages/app/src/addons/*` - Additional plugins/extensions

#### Styling
- `/packages/app/src/index.css` - Global styles and Tailwind configuration

#### Static Assets (`packages/app/public/`)
- `/packages/app/public/logo.png` - Application logo
- `/packages/app/public/submit-arrow.png` - UI icon
- `/packages/app/public/*` - Additional static assets (6 files total)

---

### 1.2 UI Component Library (`packages/ui/`)
**Shared, reusable UI primitives**

- `/packages/ui/package.json` - UI library dependencies
- `/packages/ui/src/*` - 1395 component files including:
  - `/packages/ui/src/components/icon.tsx` - Icon system
  - `/packages/ui/src/components/shopos-logo.tsx` - Logo component
  - `/packages/ui/src/assets/favicon/*` - Favicon files
  - `/packages/ui/src/assets/images/*` - Image assets

---

## 2. Backend Layer (Execution Engine & Orchestration)

### 2.1 OpenCode Core (`packages/opencode/`)
**The orchestration brain - converts intent to execution**

#### Main Entry
- `/packages/opencode/package.json` - Backend dependencies and configuration
- `/packages/opencode/src/index.ts` - Main export (4.6KB)

#### Core Modules (`packages/opencode/src/`)

**Agent & Session Management**
- `/packages/opencode/src/agent/*` - AI agent orchestration (6 files)
- `/packages/opencode/src/session/*` - Session lifecycle management (27 files)

**Server & API**
- `/packages/opencode/src/server/server.ts` - Main API server
- `/packages/opencode/src/server/project.ts` - Project management endpoints
- `/packages/opencode/src/server/question.ts` - Question handling
- `/packages/opencode/src/server/error.ts` - Error handling
- `/packages/opencode/src/server/mdns.ts` - mDNS discovery
- `/packages/opencode/src/server/tui.ts` - Terminal UI server

**CLI Interface**
- `/packages/opencode/src/cli/*` - Command-line interface (127 files)

**Tool Integration**
- `/packages/opencode/src/tool/*` - Tool adapters and implementations (44 files)

**Provider Integration**
- `/packages/opencode/src/provider/*` - AI provider integrations (22 files)

**Language Server Protocol**
- `/packages/opencode/src/lsp/*` - LSP client/server (4 files)

**Model Context Protocol**
- `/packages/opencode/src/mcp/*` - MCP integration (4 files)

**Project Management**
- `/packages/opencode/src/project/*` - Project configuration and state (5 files)

**File System**
- `/packages/opencode/src/file/*` - File operations (5 files)
- `/packages/opencode/src/worktree/*` - Git worktree management

**Configuration**
- `/packages/opencode/src/config/*` - System configuration (2 files)
- `/packages/opencode/src/env/*` - Environment variables

**Utilities**
- `/packages/opencode/src/util/*` - Helper functions (20 files)
- `/packages/opencode/src/format/*` - Formatting utilities (2 files)
- `/packages/opencode/src/id/*` - ID generation

**Authentication**
- `/packages/opencode/src/auth/*` - Authentication logic

**Inter-Process Communication**
- `/packages/opencode/src/bus/*` - Event bus (3 files)
- `/packages/opencode/src/pty/*` - Pseudo-terminal

**Permissions & Security**
- `/packages/opencode/src/permission/*` - Permission system (3 files)

**Skill System**
- `/packages/opencode/src/skill/*` - Skill framework (2 files)

**Plugins**
- `/packages/opencode/src/plugin/*` - Plugin architecture (2 files)

**Snapshots**
- `/packages/opencode/src/snapshot/*` - State snapshots

**Shell Integration**
- `/packages/opencode/src/shell/*` - Shell command execution

**Installation**
- `/packages/opencode/src/installation/*` - Setup logic

**IDE Integration**
- `/packages/opencode/src/ide/*` - IDE bridge

**Runtime**
- `/packages/opencode/src/bun/*` - Bun runtime utilities

**Access Control**
- `/packages/opencode/src/acp/*` - Access control policies (4 files)

**Commands**
- `/packages/opencode/src/command/*` - Command dispatching (3 files)

**Questions**
- `/packages/opencode/src/question/*` - Interactive question system

**Flags**
- `/packages/opencode/src/flag/*` - Feature flags

**Global State**
- `/packages/opencode/src/global/*` - Global application state

**Patch System**
- `/packages/opencode/src/patch/*` - Code patching

**Sharing**
- `/packages/opencode/src/share/*` - Session sharing (2 files)

---

## 3. Storage & Data Layer

### 3.1 Local Storage
- `/packages/opencode/src/storage/*` - Local data persistence

### 3.2 Configuration Files
- `/.opencode/*` - Application configuration directory
- `/packages/app/.gitignore` - Git ignore rules
- `/packages/opencode/.gitignore` - Git ignore rules

### 3.3 Logs
- `/logs/*` - Application logs directory

---

## 4. Build & Development Tools

### 4.1 Build Configuration
- `/vite.config.ts` - Vite bundler configuration (root)
- `/packages/app/vite.config.ts` - App-specific Vite config
- `/packages/app/vite.js` - Vite plugin extensions
- `/packages/ui/vite.config.ts` - UI library Vite config

### 4.2 TypeScript Configuration
- `/tsconfig.json` - Root TypeScript config
- `/packages/app/tsconfig.json` - App TypeScript config
- `/packages/opencode/tsconfig.json` - Backend TypeScript config
- `/packages/ui/tsconfig.json` - UI library TypeScript config

### 4.3 Package Management
- `/package.json` - Root monorepo configuration
- `/bun.lock` - Dependency lock file (625KB)
- `/bunfig.toml` - Bun runtime configuration
- `/packages/app/bunfig.toml` - App-specific Bun config
- `/packages/opencode/bunfig.toml` - Backend Bun config

### 4.4 Monorepo Tools
- `/turbo.json` - Turborepo configuration
- `/.turbo/*` - Turbo cache directory

---

## 5. SDK & External Integrations

### 5.1 SDK Packages
- `/packages/sdk/*` - Main SDK package (44 files)
- `/packages/util/*` - Utility package (13 files)
- `/packages/plugin/*` - Plugin SDK (9 files)
- `/packages/script/*` - Scripting SDK (4 files)

### 5.2 Platform-Specific
- `/packages/desktop/*` - Desktop application (40 files)
- `/packages/console/*` - Console application (347 files)
- `/packages/web/*` - Web-specific code (82 files)

### 5.3 External SDKs
- `/sdks/*` - Third-party SDK integrations (13 subdirectories)

### 5.4 Infrastructure
- `/infra/*` - Infrastructure as code (5 files)
- `/sst.config.ts` - SST deployment configuration
- `/sst-env.d.ts` - SST environment types

---

## 6. Testing & Quality Assurance

### 6.1 Test Files
- `/packages/opencode/test/*` - Backend tests (51 files)
- `/packages/app/happydom.ts` - DOM testing utilities

---

## 7. Documentation & Specifications

### 7.1 Core Documentation
- `/README.md` - Main project README
- `/README.zh-CN.md` - Chinese README
- `/README.zh-TW.md` - Traditional Chinese README
- `/CONTRIBUTING.md` - Contribution guidelines
- `/CHANGELOG.md` - Version history
- `/SECURITY.md` - Security policy
- `/LICENSE` - MIT License

### 7.2 Technical Documentation
- `/AGENTS.md` - Agent system overview (root)
- `/packages/app/AGENTS.md` - App agent documentation
- `/packages/opencode/AGENTS.md` - Backend agent documentation
- `/CLAUDE.md` - Claude AI integration notes
- `/STYLE_GUIDE.md` - Code style guide
- `/STATS.md` - Project statistics (17KB)

### 7.3 Specifications
- `/specs/*` - Technical specifications (7 files)

### 7.4 Product Documentation
- `/product_architecture_and_experience_guide.md` - System architecture guide (10KB)

---

## 8. DevOps & CI/CD

### 8.1 GitHub Integration
- `/.github/*` - GitHub workflows and templates (29 files)
- `/github/*` - Additional GitHub utilities (10 files)

### 8.2 Git Configuration
- `/.git/*` - Git repository data
- `/.gitignore` - Root ignore rules
- `/.editorconfig` - Editor configuration

### 8.3 Husky (Git Hooks)
- `/.husky/*` - Pre-commit/push hooks

### 8.4 VS Code
- `/.vscode/*` - VS Code workspace settings

---

## 9. Additional Packages

### 9.1 Enterprise Features
- `/packages/enterprise/*` - Enterprise-tier features (26 files)

### 9.2 Identity & Auth
- `/packages/identity/*` - Identity management (2 files)

### 9.3 Extensions
- `/packages/extensions/*` - Extension system (3 files)

### 9.4 Function Runtime
- `/packages/function/*` - Serverless functions (4 files)

### 9.5 Slack Integration
- `/packages/slack/*` - Slack bot (6 files)

### 9.6 Documentation Site
- `/packages/docs/*` - Documentation website (20 files)

---

## 10. Theming & Design

### 10.1 Theme Files
- `/themes/*` - Application themes (2 subdirectories)

---

## 11. Nix & System Configuration

### 11.1 Nix Files
- `/flake.nix` - Nix flake configuration
- `/flake.lock` - Nix lock file
- `/nix/*` - Nix package definitions (10 files)

---

## 12. Scripts & Automation

### 12.1 Utility Scripts
- `/script/*` - Build and deployment scripts (10 files)
- `/packages/opencode/script/*` - Backend scripts (5 files)
- `/packages/ui/script/*` - UI build scripts (2 files)
- `/install` - Installation script (13KB)

### 12.2 Binary Tools
- `/packages/opencode/bin/*` - Executable binaries

---

## 13. Patches & Overrides

### 13.1 Dependency Patches
- `/patches/*` - NPM package patches
- `/packages/opencode/parsers-config.ts` - Parser configuration overrides (11KB)

---

## Summary Statistics

| Category | File Count | Key Directories |
|----------|-----------|-----------------|
| **Frontend (App)** | ~88 files | packages/app/src |
| **Frontend (UI Library)** | ~1,395 files | packages/ui/src |
| **Backend (OpenCode)** | ~309 files | packages/opencode/src |
| **Build Tools** | ~15 files | Root + configs |
| **Tests** | ~51 files | packages/opencode/test |
| **Documentation** | ~20 files | Root + specs |
| **Total Packages** | 16 workspaces | packages/* |

---

## Critical Path for localhost:3000

When you access `localhost:3000`, the request flows through:

1. **Vite Dev Server** → `packages/app/vite.config.ts`
2. **HTML Shell** → `packages/app/index.html`
3. **SolidJS Bootstrap** → `packages/app/src/entry.tsx`
4. **Root Component** → `packages/app/src/app.tsx`
5. **Router** → `packages/app/src/pages/layout.tsx`
6. **Home/Session Pages** → `packages/app/src/pages/home.tsx` or `session.tsx`
7. **Dashboard Components** → `packages/app/src/components/dashboard/*`
8. **Backend API Calls** → `packages/opencode/src/server/server.ts`
9. **Orchestration** → `packages/opencode/src/agent/*` + `src/session/*`
10. **Tool Execution** → `packages/opencode/src/tool/*`

---

**Document Generated**: 2026-01-15  
**For**: OpenCode Application Architecture Analysis
