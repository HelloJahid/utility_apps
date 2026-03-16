# AusTaka

**Australia → Bangladesh Remittance Calculator**

A minimal, fast, single-page web app for calculating remittance amounts from Australia to Bangladesh. Supports two modes:

- **Send AUD** — enter the AUD amount you want to send and see the final BDT received
- **Target BDT** — enter the BDT amount you want delivered and see the exact AUD required

Built with **React + Vite**. No backend, no database, no authentication required.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

---

### Install dependencies

```bash
cd austaka
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output goes to the `dist/` folder.

### Preview production build locally

```bash
npm run preview
```

---

## Deploy to Vercel

### Option 1 — Vercel Dashboard (recommended)

1. Push the project to a GitHub repository
2. Sign in to [vercel.com](https://vercel.com)
3. Click **New Project**
4. Import your GitHub repository
5. Vercel will automatically detect **Vite** as the framework
6. Keep the default settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
7. Set the **Root Directory** to `austaka` if the repo contains other projects at the root
8. Click **Deploy**
9. Your app will be live at a `.vercel.app` URL within seconds

### Future updates

- Every push to the connected Git branch triggers an automatic redeployment
- Pull requests automatically receive **preview deployment URLs** for review before merging to production

---

### Option 2 — Vercel CLI

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Inside the austaka directory, link to your Vercel project
vercel link

# Deploy a preview
vercel deploy

# Deploy to production
vercel deploy --prod
```

---

## Project structure

```
austaka/
├── index.html          # App entry point
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx        # React root mount
    ├── App.jsx         # Main calculator component
    └── App.css         # All styles
```

---

## Formulas used

### Mode 1 — Send AUD

```
convertedBDT     = audAmount × rate
incentiveBDT     = convertedBDT × (incentive% / 100)
finalReceivedBDT = convertedBDT + incentiveBDT
```

### Mode 2 — Target BDT

```
convertedBDT     = targetBDT / (1 + incentive% / 100)
incentiveBDT     = convertedBDT × (incentive% / 100)
audRequired      = convertedBDT / rate
finalReceivedBDT = convertedBDT + incentiveBDT
```

---

## License

MIT
