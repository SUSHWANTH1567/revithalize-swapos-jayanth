# 🔋 SwapOS – Battery Swap Network Operating System

> A full-stack operations platform for managing battery-swapping stations, battery fleets, riders, revenue, restocking intelligence, and network performance.

🌐 **Upstream Demo (Reference):** https://revithalize-swapos-jayanth.vercel.app<br />
💻 **GitHub Repository:** https://github.com/SUSHWANTH1567/revithalize-swapos-jayanth

---

## 🚀 Overview

SwapOS is a Battery Swap Network Operating System designed to help operators monitor and manage a distributed battery-swapping network from a single dashboard.

## 🎯 Key Features

- 🏪 Station Management
- 🔋 Battery Fleet Management
- 👥 Rider Management
- 📦 Restock Intelligence
- 📈 Revenue Dashboard
- ⚡ Electricity Cost Analysis
- 💰 Gross Margin Calculation
- 📊 90-Day Historical Analytics
- 💵 Payback Calculator
- 📍 Station-Level Monitoring

## 🏪 Network

| Metric | Value |
|---|---:|
| Stations | 5 |
| Slots | 30 |
| Battery Records | 24 |
| Riders | 10 |
| Historical Transactions | ~3,600 |
| Historical Period | 90 Days |
| Electricity Tariff | ₹6.50/kWh |

### Stations

- Station 01 — Warangal Central
- Station 02 — Kazipet
- Station 03 — Hanamkonda
- Station 04 — NIT Warangal
- Station 05 — Subedari

## 📈 Financial Analytics

### Mock Network Metrics

| Metric | Value |
|---|---:|
| Revenue | ₹277,200 |
| Electricity Cost | ₹144,144 |
| Gross Margin | ₹133,056 |
| Gross Margin % | ~48% |

### Electricity Cost Formula

```text
Electricity Cost = Energy Consumption (kWh) × ₹6.50/kWh
Gross Margin = Total Revenue - Electricity Cost
Gross Margin % = (Gross Margin / Total Revenue) × 100
```

---

## 🏗️ Architecture

```text
React (Vite 8 + Tailwind v4)
       ↓
    REST API
       ↓
FastAPI Backend (Render)
       ↓
   SQLite DB
```

### 🔌 API Endpoints

- `GET /` - Root health message
- `GET /api/health` - Service status
- `GET /api/stations` - Station slot inventory and location data
- `GET /api/batteries` - Fleet telemetry, SoH, SoC, and status
- `GET /api/riders` - Active riders and swap counts
- `GET /api/transactions` - Historical swap transaction logs
- `GET /api/dashboard` - High-level aggregated network metrics

---

## 📁 Project Structure

```text
revithalize-swapos-jayanth/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD Pipeline
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── data/              # Mock fallback datasets
│   │   ├── pages/             # Dashboard views & UI
│   │   ├── services/          # REST API clients (api.js & api.test.js)
│   │   ├── utils/             # Business calculations & test suite
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .oxlintrc.json         # Oxlint configuration
│   ├── package.json           # Scripts, dependencies, Vitest configuration
│   ├── vercel.json            # Vercel SPA routing rules
│   └── vite.config.js         # Vite bundler configuration
├── backend/
│   ├── database.py
│   ├── main.py
│   ├── requirements.txt
│   ├── seed.py
│   └── swapos.db
└── README.md
```

---

## 💻 Local Setup & Development

### 1. Prerequisites
- **Node.js**: v20+ (tested with v24.18)
- **npm**: v10+ (tested with v11.16)
- **Python**: 3.10+ (for backend)

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install exact dependencies
npm ci

# Run linter
npm run lint

# Run unit test suite
npm test

# Run tests in watch mode during development
npm run test:watch

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Start local development server
npm run dev
```

### 3. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

The repository uses an automated CI/CD pipeline defined in [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml).

### Workflow Triggers

| Event | Target Branch | Jobs Executed | Purpose |
|---|---|---|---|
| `pull_request` | `main` | `lint-and-test` | Verifies code quality, linting (`oxlint`), and runs unit tests (`vitest`) before merging. |
| `push` | `main` | `lint-and-test` ➔ `deploy-preview` | Runs tests, then builds and deploys to a **Vercel Preview environment** with Slack alerts. |

### 🛡️ Production Deployment Safeguards

To prevent accidental production overwrites:
1. **Isolated Preview Environment**: The pipeline runs `vercel pull --yes --environment=preview` and builds specifically for preview.
2. **Strict Production Flag Exclusion**: The command `vercel deploy --prebuilt` executes **without** the `--prod` flag. This guarantees that Vercel creates an isolated preview URL (e.g. `https://revithalize-swapos-jayanth-git-...vercel.app`).
3. **Production URL Protected**: The live production URL (`https://revithalize-swapos-jayanth.vercel.app`) remains untouched.
4. **Strict Job Dependency**: Deployment runs only if the `lint-and-test` job passes 100%.

### 💬 Slack Notifications

The pipeline automatically posts Slack notification cards to your configured channel on:
- **Deployment Success (`success`)**: Outputs branch, commit SHA, committer, and the direct clickable Vercel Preview URL.
- **Deployment Failure (`failure`)**: Outputs branch, commit SHA, trigger actor, and a direct link to the failed GitHub Actions run logs.

---

## 🔐 Required GitHub Repository Secrets

Configure the following secrets under **Repository Settings ➔ Secrets and variables ➔ Actions ➔ Repository secrets**:

| Secret Name | Description | Where to Obtain |
|---|---|---|
| `VERCEL_TOKEN` | Personal Access Token for Vercel CLI | Vercel Dashboard ➔ Settings ➔ Tokens ➔ Create Token |
| `VERCEL_ORG_ID` | Vercel Organization / User Account ID | Found in `.vercel/project.json` or Vercel Team Settings |
| `VERCEL_PROJECT_ID` | Project Identifier in Vercel | Vercel Dashboard ➔ Project Settings ➔ General ➔ Project ID |
| `SLACK_WEBHOOK_URL` | Incoming Webhook URL for Slack channel | Slack API ➔ Your Apps ➔ Incoming Webhooks ➔ Add New Webhook to Workspace |

> **Note on Security:** Credentials and tokens are strictly accessed via `${{ secrets.<NAME> }}`. No keys, secrets, or identifiers are committed to version control.

---

## 🧪 Testing & Verification Guide

### Local Verification

Execute the following commands from the repository root:

```bash
# 1. Clean install dependencies
cd frontend && npm ci

# 2. Run Oxlint code analysis
npm run lint

# 3. Execute Vitest unit test suite (29 tests)
npm test

# 4. Verify Vite production build
npm run build
```

### Automated CI/CD Verification

1. **Verify PR Validation (CI):**
   - Create a feature branch: `git checkout -b feature/test-ci`
   - Make a change and push: `git push origin feature/test-ci`
   - Open a Pull Request targeting `main`.
   - Verify that the `Lint & Unit Tests` check runs and passes.
2. **Verify Preview Deployment (CD):**
   - Merge the PR into `main`.
   - Verify that `Lint & Unit Tests` passes, followed by `Build & Deploy to Vercel Preview`.
   - Check your Slack channel for the green success message with the unique Preview deployment link.
   - Verify that the production site at `https://revithalize-swapos-jayanth.vercel.app` remains intact and unaffected.

---

## 🩺 Troubleshooting Guide

### 1. `npm test` fails
- **Cause**: Unmatched assertion or broken API endpoint expectation.
- **Fix**: Check `src/utils/calculations.test.js` or `src/services/api.test.js` and verify recent changes against expected schemas.

### 2. Vercel deployment returns `Error: Invalid project id` or `401 Unauthorized`
- **Cause**: Incorrect or expired `VERCEL_TOKEN`, `VERCEL_ORG_ID`, or `VERCEL_PROJECT_ID`.
- **Fix**: Verify secrets in GitHub repository settings. Retrieve the active IDs by running `npx vercel link` locally or checking Vercel Project Settings.

### 3. Slack notification step reports `SLACK_WEBHOOK_URL is not set`
- **Cause**: The `SLACK_WEBHOOK_URL` secret has not been added to repository secrets yet.
- **Behavior**: The step gracefully skips without failing the deployment. To enable notifications, add the webhook URL in GitHub Secrets.

---

## 👨‍💻 Developer Attribution

**Original Creator:** M. Jayanth<br />
B.Tech – CSE (Artificial Intelligence & Machine Learning)<br />
SR University

**Skills:** Java • Python • C • SQL • JavaScript • React • FastAPI • AI/ML • Git • GitHub • DevOps

---

## 📌 Disclaimer

This project uses mock/demo operational data for development, demonstration, and evaluation purposes.
