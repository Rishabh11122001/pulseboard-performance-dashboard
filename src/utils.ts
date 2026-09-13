import type { Filters, KPI, Transaction } from "./types";

export const TABLE_SAMPLE_LIMIT = 1000;

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1_000_000 ? 2 : 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: value >= 100_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCroreAxis(value: number) {
  const crore = value / 10_000_000;
  return `${crore >= 10 ? crore.toFixed(0) : crore.toFixed(1)}Cr`;
}

export function analyzeTransactions(rows: Transaction[], filters: Filters) {
  const search = filters.search.trim().toUpperCase();

  let filteredCount = 0;
  let revenue = 0;

  const customers = new Set<string>();
  const monthly = new Map<string, number>();

  const categoryTotals: Record<string, number> = {
    Electronics: 0,
    Fashion: 0,
    Home: 0,
    Beauty: 0,
    Sports: 0,
  };

  const statusTotals: Record<string, number> = {
    Delivered: 0,
    Shipped: 0,
    Processing: 0,
    Cancelled: 0,
  };

  const regionTotals: Record<string, number> = {
    North: 0,
    South: 0,
    East: 0,
    West: 0,
  };

  // Product decision:
  // process the full dataset for accurate KPIs/charts, but only keep a bounded
  // table sample. A human does not benefit from scrolling through 250K rows.
  const tableRows: Transaction[] = [];

  for (const row of rows) {
    if (filters.region !== "All" && row.region !== filters.region) continue;
    if (filters.category !== "All" && row.category !== filters.category) continue;
    if (filters.status !== "All" && row.status !== filters.status) continue;

    if (
      search &&
      !row.orderId.includes(search) &&
      !row.customerId.includes(search)
    ) {
      continue;
    }

    filteredCount += 1;
    revenue += row.revenue;
    customers.add(row.customerId);

    const month = row.date.slice(0, 7);
    monthly.set(month, (monthly.get(month) ?? 0) + row.revenue);

    categoryTotals[row.category] += row.revenue;
    statusTotals[row.status] += 1;
    regionTotals[row.region] += row.revenue;

    if (tableRows.length < TABLE_SAMPLE_LIMIT) {
      tableRows.push(row);
    }
  }

  const kpi: KPI = {
    revenue,
    orders: filteredCount,
    customers: customers.size,
    aov: filteredCount ? revenue / filteredCount : 0,
  };

  const monthlyData = [...monthly.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, monthRevenue]) => ({
      month: new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      revenue: monthRevenue,
    }));

  const categoryData = Object.entries(categoryTotals)
    .map(([category, categoryRevenue]) => ({
      category,
      revenue: categoryRevenue,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const statusData = Object.entries(statusTotals)
    .map(([status, count]) => ({ status, count }))
    .filter((row) => row.count > 0);

  const regionData = Object.entries(regionTotals)
    .map(([region, regionRevenue]) => ({
      region,
      revenue: regionRevenue,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return {
    filteredCount,
    tableRows,
    kpi,
    monthly: monthlyData,
    category: categoryData,
    status: statusData,
    region: regionData,
  };
}
