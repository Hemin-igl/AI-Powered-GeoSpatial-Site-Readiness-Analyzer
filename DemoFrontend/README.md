<div align="center">

# 📍 GeoReady — AI-Powered Geospatial Site Readiness Analyzer

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Uber H3](https://img.shields.io/badge/Spatial_Index-Uber_H3-FF007A)](https://h3geo.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**GeoReady** is an advanced, enterprise-grade geospatial analytics dashboard designed for location intelligence, retail site selection, competitor analysis, risk assessment, and site readiness evaluation.

---

</div>

## ✨ Key Features

- **🗺️ Interactive GIS & Spatial Analytics**: High-density geospatial map visualization powered by Uber H3 hexagonal spatial indexing.
- **📊 360° Candidate Site Evaluation**: Multi-criteria decision matrix analyzing accessibility, foot traffic, competitor density, land use, environmental risk, and financial viability.
- **⚡ Spatial Hotspot Analysis**: Dynamic heatmaps identifying high-opportunity zones and market gaps across urban sectors.
- **🤖 Built-in GeoReady AI Copilot**: Intelligent conversational assistant for spatial querying, site recommendations, and automated feasibility reports.
- **⚖️ Multi-Site Comparison Studio**: Side-by-side comparative benchmarking for candidate site shortlisting.
- **🛡️ Comprehensive Risk Engine**: Flooding, zoning restriction, supply chain vulnerability, and economic fluctuation risk modeling.
- **📑 Executive Report Generator**: One-click generation of PDF/CSV spatial feasibility reports.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React 19, TypeScript 7, Vite 8 |
| **Styling & UI** | Tailwind CSS v4, Lucide Icons, Framer Motion |
| **Data Visualization** | Recharts, Leaflet/Spatial Data Layers |
| **Spatial Indexing** | Uber H3 Hexagonal Grid Engine |
| **AI Copilot** | Google Gemini Generative AI SDK |

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/Hemin-igl/AI-Powered-GeoSpatial-Site-Readiness-Analyzer.git
cd AI-Powered-GeoSpatial-Site-Readiness-Analyzer/DemoFrontend
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Environment Setup (Optional for AI Copilot)
Copy the example environment file and set your API key:
```bash
cp .env.example .env.local
```
Add your Google Gemini API key to `.env.local`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`** 🚀

---

## 📁 Project Structure

```
DemoFrontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI Components
│   │   ├── Navbar.tsx      # Top Navigation & Quick Actions
│   │   ├── Sidebar.tsx     # Workspace Menu
│   │   ├── SiteDrawer.tsx  # Slide-over Site Detail Drawer
│   │   ├── NewSiteModal.tsx# Custom Coordinate Analyzer
│   │   └── AiAssistantModal.tsx # GeoReady AI Copilot Chat
│   ├── data/               # Spatial Datasets & Mock Models
│   ├── pages/              # Module Views
│   │   ├── HomePage.tsx            # Dashboard Overview & Hero
│   │   ├── SiteAnalysisPage.tsx    # Multi-factor Suitability Model
│   │   ├── OpportunityMapPage.tsx  # Spatial H3 Grid & Hotspots
│   │   ├── AccessibilityPage.tsx   # Isochrone & Transport Analytics
│   │   ├── CompetitionPage.tsx     # Competitor Proximity Index
│   │   ├── DemographicsPage.tsx    # Population & Spending Metrics
│   │   ├── RiskAnalysisPage.tsx    # Environmental & Financial Risks
│   │   └── CompareSitesPage.tsx    # Side-by-side Site Benchmarking
│   ├── services/           # GIS & Scoring Logic
│   ├── types.ts            # TypeScript Models
│   ├── App.tsx             # Main App Router & Workspace
│   └── main.tsx            # Entry Point
├── package.json
└── vite.config.ts
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/Hemin-igl/AI-Powered-GeoSpatial-Site-Readiness-Analyzer/issues).

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

