================================================================================
HORUS
Autonomous Solana Cabal Sentinel & Intelligence Core
PROJECT OVERVIEW
HORUS is a full-stack, agentic blockchain surveillance platform designed to
de-anonymize insider coordination in the Solana ecosystem. The software
integrates real-time Helius RPC telemetry, a proprietary heuristic risk
engine, and force-directed graph visualization to identify hidden multi-hop
funding clusters before they dump on retail liquidity.

This is NOT a standard blockchain explorer. It is an event-driven Intelligence
Core built for the Superteam Agentic Engineering Grant, designed to transition
traders from manual "searching" to autonomous "monitoring."

PROBLEM STATEMENT
The Solana memecoin ecosystem has devolved into an arms race of information
asymmetry.

Coordinated insider groups ("cabals") silently accumulate token supply
across complex, multi-hop sub-wallet networks.

Total supply concentration is obfuscated, tricking retail traders and
liquidity providers into providing exit liquidity.

Manual block exploration is too slow to catch coordinated consolidation in
real-time.

Result: Retail traders are consistently exploited due to lack of automated
telemetry, not lack of trading skill.

SOLUTION
HORUS provides:

Automated recursive tracing of funding origins via Helius Enhanced RPC.

Mathematical clustering of addresses based on common funding roots (extracting
feePayers and mapping tokenTransfers).

The Cabal Control Index (CCI): A real-time proprietary risk metric computing
supply concentration and coordination risk.

A React-based force-directed graph mapping the "Web of Influence" between
Root Funders and Sub-Wallets.

Autonomous Pulse: Event-driven webhooks alerting users to network state
changes the moment they hit the mempool.

KEY FEATURES
RECURSIVE MULTI-HOP TRACING

Automatically follows the "money trail" using the Helius Enhanced
Transactions API (GET /v0/addresses/{address}/transactions).

Identifies Root Funders and secondary Sub-Wallets instantly.

CABAL CONTROL INDEX (CCI)

Dynamic heuristic risk scoring engine.

Measures supply concentration and cluster density.

Calculates the probability of insider consolidation on fresh mints.

EVENT-DRIVEN WEBHOOK PIPELINE

Sub-second latency on network state changes.

Streams live mempool and ledger updates to the frontend via WebSockets.

Eliminates the need for manual page refreshing.

VISUALIZATION ENGINE

D3.js powered force-directed graph visualization.

Maps total token transfers, collapsing complex multi-wallet obfuscation
into clear, actionable visual clusters.

STRATEGY BACKTESTING (IN DEVELOPMENT)

Historical simulation mode.

Allows users to replay past token launches and analyze accumulation phases
to refine their operational strategies.

AUTONOMOUS EXECUTION (ROADMAP)

Conditional risk alerts.

Automated triggers that fire defensive sell-orders or liquidity warnings
when the CCI breaches critical thresholds.

TECHNOLOGY STACK
Backend Core:

Python 3.11+

FastAPI (High-performance async API framework)

HTTPX (Asynchronous HTTP requests)

Uvicorn (ASGI web server)

Frontend & Visualization:

React (User Interface)

TypeScript / JavaScript

D3.js (Force-directed graph generation)

Blockchain Data & Telemetry:

Helius RPC (Solana node infrastructure)

Helius Enhanced Transactions API

Helius Webhooks (Real-time event streams)

PROJECT STRUCTURE
HORUS/
├── backend/                          # Intelligence Core
│   ├── main.py                       # Root FastAPI entry point & API routes
│   ├── requirements.txt              # Python dependencies
│   ├── .env                          # Environment variables (Helius Key)
│   ├── tracing_engine/               # Multi-hop ledger parsing logic
│   └── websockets/                   # Real-time event streaming
│
├── frontend/                         # Visualization & UI
│   ├── src/
│   │   ├── App.tsx                   # Main React application
│   │   ├── components/
│   │   │   ├── GraphViewer.tsx       # D3.js Force-directed graph
│   │   │   ├── Dashboard.tsx         # CCI Risk Metrics & Stats
│   │   │   └── SearchBar.tsx         # Token mint input
│   ├── package.json                  # Node.js dependencies
│   └── .env                          # Frontend configurations
│
├── README.md                         # Documentation
└── .gitignore                        # Git exclusion rules

HORUS/
├── backend/                          # Intelligence Core
│   ├── main.py                       # Root FastAPI entry point & API routes
│   ├── requirements.txt              # Python dependencies
│   ├── .env                          # Environment variables (Helius Key)
│   ├── tracing_engine/               # Multi-hop ledger parsing logic
│   └── websockets/                   # Real-time event streaming
│
├── frontend/                         # Visualization & UI
│   ├── src/
│   │   ├── App.tsx                   # Main React application
│   │   ├── components/
│   │   │   ├── GraphViewer.tsx       # D3.js Force-directed graph
│   │   │   ├── Dashboard.tsx         # CCI Risk Metrics & Stats
│   │   │   └── SearchBar.tsx         # Token mint input
│   ├── package.json                  # Node.js dependencies
│   └── .env                          # Frontend configurations
│
├── README.md                         # Documentation
└── .gitignore                        # Git exclusion rules

INSTALLATION
Clone or download the project repository:
git clone https://github.com/Linex-lunk/nuthin3bro.git
cd nuthin3bro

Configure the Backend (Terminal 1):
cd backend

Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Linux/Mac

Install dependencies
pip install fastapi uvicorn httpx

Set up your Helius API Key
echo "HELIUS_API_KEY=your_actual_helius_api_key_here" > .env

Configure the Frontend (Terminal 2):
cd frontend
npm install

Run the Application:

In backend terminal:
uvicorn main:app --reload

In frontend terminal:
npm run dev

HOW TO USE
BASIC WORKFLOW:

Open the local React frontend in your browser.

Paste a freshly launched Solana token mint address into the search bar.

Click "Scan".

The backend Intelligence Core will query the Helius RPC, mapping the token
transfers and extracting feePayers.

Review the Cabal Control Index (CCI) score to gauge insider risk.

Inspect the D3.js graph to visually identify the "Root Funders" and how
many sub-wallets they are currently funding to obfuscate supply.

DEPLOYMENT ROADMAP
Milestone 1 — REAL-TIME HELIUS RPC & WEBHOOK INTEGRATION (Current)
Status: Beta/Early Stage
Goals: Replace static templates with live data parsing, secure .env config.

Milestone 2 — ALGORITHMIC CLUSTERING & CABAL VERIFICATION
Status: Pending Live Testing
Goals: Live block parsing, accurate CCI computation on live token mints.

Milestone 3 — STRATEGY BACKTESTING FRAMEWORK
Status: Planned
Goals: Build dedicated simulation engine for past market movements.

Milestone 4 — AUTONOMOUS AGENTIC EXECUTION
Status: Planned
Goals: Implement automated triggers that fire the moment the CCI breaches
critical thresholds.

TECHNICAL NOTES
API REQUIREMENTS:

A valid Helius API Key is STRICTLY REQUIRED for this application to function.

Without the key, the system will fail to fetch GET /v0/addresses/....

GRAPH SCALABILITY:

Highly dense cabal networks (500+ sub-wallets) may cause slight rendering
delays on the frontend due to D3.js physics calculations.

TROUBLESHOOTING
Q: "Folders not pushing to GitHub / Grayed out directories"
A: You likely have nested .git folders. Run rm -rf backend/.git and
rm -rf frontend/.git, ensure your .gitignore is set up properly, and
re-commit the root directory.

Q: "Backend returns 401 Unauthorized or 403 Forbidden"
A: Check your backend/.env file. Your HELIUS_API_KEY is likely missing,
expired, or incorrectly formatted.

Q: "Graph is rendering static/mock data"
A: Ensure you have transitioned from the simulation fallback templates to the
actual async httpx Helius calls in main.py.

AUTHOR & CONTACT
Mehdi El Alaoui
Rabat, Morocco

GitHub:    github.com/Linex-lunk/Horus
LinkedIn:  linkedin.com/in/mehdi-el-alaoui-485a90262
Email:     mehdielalaoui420@gmail.com


LEGAL DISCLAIMER
HORUS is an ANALYTICAL TELEMETRY TOOL ONLY.

It is NOT:

Financial advice.

A guarantee against financial loss, rug-pulls, or smart contract exploits.

A fully automated trading bot (in its current V1 stage).

Cryptocurrency and memecoin trading involve extreme financial risk. All
Cabal Control Index (CCI) metrics are algorithmic probabilities, not absolute
certainties. The developers assume no responsibility for trading losses
incurred while using this software.

================================================================================
Last Updated: August 2026
License: Proprietary
