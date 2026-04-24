# Operon Intelligence

**AI-powered CFPB complaint resolution pipeline.**

A multi-agent system that classifies, risk-scores, routes, and resolves financial complaints in seconds — with full explainability and audit trails.

## Tech Stack

- **Frontend**: React 19, Vite 8, Recharts
- **AI Pipeline**: Python · LangGraph · LangChain
- **Styling**: Vanilla CSS (no Tailwind)
- **Deployment**: Vercel (this repo) + backend on separate service

## Team

Tauksik · Priyam · Premal · Manan

## Local Development

```bash
npm install
npm run dev
```

Runs at `http://localhost:8888`

## Deployment

This project is configured for instant Vercel deployment.

1. Push to GitHub
2. Import into Vercel — it auto-detects Vite
3. No environment variables required for the frontend

**Live site**: [operon.website](https://operon.website)

## Project Structure

```
src/
  App.jsx       # All slides + components (single-file architecture)
  index.css     # Design system tokens + utilities
  main.jsx      # React entry point
public/
  favicon.svg   # Site icon
vercel.json     # SPA rewrite rules
```
