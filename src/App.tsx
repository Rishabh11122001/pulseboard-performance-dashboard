import { useMemo, useState } from "react";
import { generateTransactions } from "./data";
import { useDebouncedValue } from "./useDebouncedValue";
import type { Filters } from "./types";
import {
  analyzeTransactions,
  formatINR,
  TABLE_SAMPLE_LIMIT,
} from "./utils";
import { KPICard } from "./components/KPICard";
import {
  CategoryChart,
  RegionChart,
  RevenueTrend,
  StatusChart,
} from "./components/Charts";
import { VirtualizedTable } from "./components/VirtualizedTable";

const DATASET_OPTIONS = [
  { value: 50_000, label: "50K" },
  { value: 100_000, label: "100K" },
  { value: 250_000, label: "250K" },
];

export default function App() {
  const [datasetSize, setDatasetSize] = useState(250_000);
  const [filters, setFilters] = useState<Filters>({
    region: "All",
    category: "All",
    status: "All",
    search: "",
  });

  const debouncedSearch = useDebouncedValue(filters.search, 220);

  const generation = useMemo(() => {
    const started = performance.now();
    const data = generateTransactions(datasetSize);
    return { data, ms: performance.now() - started };
  }, [datasetSize]);

  const analysis = useMemo(() => {
    const started = performance.now();
    const result = analyzeTransactions(generation.data, {
      ...filters,
      search: debouncedSearch,
    });

    return {
      ...result,
      ms: performance.now() - started,
    };
  }, [
    generation.data,
    filters.region,
    filters.category,
    filters.status,
    debouncedSearch,
  ]);

  const clearFilters = () =>
    setFilters({
      region: "All",
      category: "All",
      status: "All",
      search: "",
    });

  const activeFilterCount =
    Number(filters.region !== "All") +
    Number(filters.category !== "All") +
    Number(filters.status !== "All") +
    Number(Boolean(debouncedSearch));

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark">P</span>
          <span>PulseBoard</span>
        </a>

        <nav className="nav-links">
          <a href="#overview">Overview</a>
          <a href="#analysis">Analysis</a>
          <a href="#records">Records</a>
        </nav>

        <div className="dataset-switcher">
          {DATASET_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={datasetSize === option.value ? "active" : ""}
              onClick={() => setDatasetSize(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <main id="top">
        <section className="hero" id="overview">
          <div className="hero-visual" aria-hidden="true">
            <div className="terrain terrain-one" />
            <div className="terrain terrain-two" />
            <div className="terrain terrain-three" />
            <div className="hero-grid-line hero-grid-a" />
            <div className="hero-grid-line hero-grid-b" />
          </div>

          <div className="hero-copy">
            <p className="eyebrow">Performance-critical analytics</p>
            <h1>
              Make large data
              <br />
              feel lightweight.
            </h1>
            <p>
              Explore up to 250,000 e-commerce transactions with responsive
              filtering, single-pass aggregation and virtualized rendering.
            </p>
            <a href="#analysis" className="hero-link">
              Explore the dashboard <span>↘</span>
            </a>
          </div>

          <aside className="hero-stats">
            <div className="hero-stat">
              <span>01 / dataset</span>
              <strong>{generation.data.length.toLocaleString()}</strong>
              <small>rows loaded</small>
            </div>
            <div className="hero-stat">
              <span>02 / matching</span>
              <strong>{analysis.filteredCount.toLocaleString()}</strong>
              <small>rows after filters</small>
            </div>
            <div className="hero-stat">
              <span>03 / compute</span>
              <strong>{analysis.ms.toFixed(1)} ms</strong>
              <small>filter + aggregate</small>
            </div>
          </aside>
        </section>

        <section className="kpi-grid">
          <KPICard
            label="Revenue"
            value={formatINR(analysis.kpi.revenue)}
            helper="non-cancelled order value"
          />
          <KPICard
            label="Orders"
            value={analysis.kpi.orders.toLocaleString()}
            helper="matching transactions"
          />
          <KPICard
            label="Average order value"
            value={formatINR(analysis.kpi.aov)}
            helper="revenue / matching orders"
          />
          <KPICard
            label="Customers"
            value={analysis.kpi.customers.toLocaleString()}
            helper="unique customer IDs"
          />
        </section>

        <section className="analysis-section" id="analysis">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Interactive analysis</p>
              <h2>One control. Every view responds.</h2>
            </div>
            <p>
              Filter from the controls or click a category, status, or region
              directly inside a chart to cross-filter the dashboard.
            </p>
          </div>

          <div className="filter-bar">
            <label>
              <span>Region</span>
              <select
                value={filters.region}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    region: event.target.value as Filters["region"],
                  }))
                }
              >
                <option>All</option>
                <option>North</option>
                <option>South</option>
                <option>East</option>
                <option>West</option>
              </select>
            </label>

            <label>
              <span>Category</span>
              <select
                value={filters.category}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    category: event.target.value as Filters["category"],
                  }))
                }
              >
                <option>All</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home</option>
                <option>Beauty</option>
                <option>Sports</option>
              </select>
            </label>

            <label>
              <span>Status</span>
              <select
                value={filters.status}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    status: event.target.value as Filters["status"],
                  }))
                }
              >
                <option>All</option>
                <option>Delivered</option>
                <option>Shipped</option>
                <option>Processing</option>
                <option>Cancelled</option>
              </select>
            </label>

            <label className="search-control">
              <span>Order / customer</span>
              <input
                value={filters.search}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    search: event.target.value,
                  }))
                }
                placeholder="Search ID"
              />
            </label>

            <button
              className="clear-button"
              type="button"
              onClick={clearFilters}
              disabled={activeFilterCount === 0}
            >
              Clear {activeFilterCount ? `(${activeFilterCount})` : ""}
            </button>
          </div>

          <div className="active-chips" aria-live="polite">
            {filters.region !== "All" && (
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f, region: "All" }))}
              >
                Region: {filters.region} ×
              </button>
            )}
            {filters.category !== "All" && (
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f, category: "All" }))}
              >
                Category: {filters.category} ×
              </button>
            )}
            {filters.status !== "All" && (
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f, status: "All" }))}
              >
                Status: {filters.status} ×
              </button>
            )}
            {debouncedSearch && (
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f, search: "" }))}
              >
                Search: {debouncedSearch} ×
              </button>
            )}
            {activeFilterCount === 0 && (
              <span>
                Showing all {generation.data.length.toLocaleString()} records
              </span>
            )}
          </div>

          <div className="charts-grid">
            <div className="chart-wide">
              <RevenueTrend data={analysis.monthly} />
            </div>

            <CategoryChart
              data={analysis.category}
              selected={filters.category}
              onSelect={(category) =>
                setFilters((current) => ({
                  ...current,
                  category:
                    current.category === category ? "All" : category,
                }))
              }
            />

            <StatusChart
              data={analysis.status}
              selected={filters.status}
              onSelect={(status) =>
                setFilters((current) => ({
                  ...current,
                  status: current.status === status ? "All" : status,
                }))
              }
            />

            <div className="chart-wide">
              <RegionChart
                data={analysis.region}
                selected={filters.region}
                onSelect={(region) =>
                  setFilters((current) => ({
                    ...current,
                    region: current.region === region ? "All" : region,
                  }))
                }
              />
            </div>
          </div>
        </section>

        <section className="records-section" id="records">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Transaction inspection</p>
              <h2>Inspect the signal, not endless rows.</h2>
            </div>
            <p>
              Full data drives every KPI and chart. The table keeps a bounded
              sample and only renders the rows currently visible on screen.
            </p>
          </div>

          <div className="records-meta">
            <div>
              <span>Matching records</span>
              <strong>{analysis.filteredCount.toLocaleString()}</strong>
            </div>
            <div>
              <span>Table preview</span>
              <strong>
                {Math.min(
                  analysis.filteredCount,
                  TABLE_SAMPLE_LIMIT
                ).toLocaleString()}
              </strong>
            </div>
            <div>
              <span>Filter + aggregate</span>
              <strong>{analysis.ms.toFixed(1)} ms</strong>
            </div>
          </div>

          <VirtualizedTable
            rows={analysis.tableRows}
            totalMatches={analysis.filteredCount}
          />
        </section>

        <footer>
          <span>PulseBoard</span>
          <span>
            React · TypeScript · Recharts · single-pass aggregation ·
            virtualization
          </span>
        </footer>
      </main>
    </div>
  );
}
