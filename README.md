# PulseBoard

PulseBoard is a performance-focused React + TypeScript analytics dashboard designed to keep interaction responsive while exploring up to **250,000 transaction records in the browser**.

## Live Demo

**Live Application:** https://pulseboard-performance-dashboard.vercel.app

**GitHub Repository:** https://github.com/Rishabh11122001/pulseboard-performance-dashboard

## Why this project exists

Built for the **Performance-Critical Data Visualization Dashboard** assignment. The challenge is not simply drawing charts; it is reducing unnecessary work while filtering, aggregating and rendering a large analytical dataset.

## Core performance techniques

- Memoized dataset generation
- Memoized filtering and aggregation with `useMemo`
- Debounced search
- Aggregated chart inputs instead of raw rows
- Manual fixed-row virtualization for the transaction table
- Chart animations disabled during interaction
- Built-in performance timings using `performance.now()`

## Features

- 50K / 100K / 250K dataset modes
- Revenue, orders, AOV and unique customer KPIs
- Region, category and status filters
- Debounced order/customer search
- Revenue trend, category, status and region charts
- Virtualized transaction table
- Performance monitor
- Responsive layout

## Stack

React, TypeScript, Vite, Recharts, CSS

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Performance architecture

```text
Synthetic dataset
      ↓
memoized filtering
      ↓
aggregated KPI/chart data
      ↓
small chart datasets

Large filtered rows
      ↓
virtualized viewport
      ↓
~20–40 DOM rows rendered at once
```

## Known limitations

- Dataset is synthetic for reproducible benchmarking.
- Heavy analytics still run on the main thread; a Web Worker is the next upgrade.
- Custom virtualization assumes fixed row height.
- This demo focuses on browser performance, not backend/database optimization.
