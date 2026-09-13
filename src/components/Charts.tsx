import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Category, OrderStatus, Region } from "../types";
import { formatCroreAxis, formatINR } from "../utils";

const LINE = "#d2ddd8";
const TEXT = "#aebdb7";
const ACCENT = "#d5e06f";
const BAR = "#8fb8aa";
const BAR_MUTED = "#31545a";
const STATUS = ["#d5e06f", "#8fb8aa", "#527b75", "#2d4c52"];

function tooltipStyle() {
  return {
    border: "1px solid #27484d",
    borderRadius: "8px",
    boxShadow: "0 12px 30px rgba(0,0,0,.25)",
    background: "#0d252b",
    color: "#eef4f1",
  };
}

export function RevenueTrend({
  data,
}: {
  data: { month: string; revenue: number }[];
}) {
  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <p>Trend</p>
          <h3>Revenue over time</h3>
        </div>
        <span>Monthly</span>
      </div>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              stroke={LINE}
              strokeOpacity={0.16}
              strokeDasharray="3 6"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              minTickGap={30}
              tick={{ fontSize: 11, fill: TEXT }}
              axisLine={{ stroke: "#24454b" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCroreAxis}
              width={58}
              tick={{ fontSize: 11, fill: TEXT }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [formatINR(value), "Revenue"]}
              contentStyle={tooltipStyle()}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={ACCENT}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: ACCENT }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function CategoryChart({
  data,
  selected,
  onSelect,
}: {
  data: { category: string; revenue: number }[];
  selected: "All" | Category;
  onSelect: (category: Category) => void;
}) {
  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <p>Category mix</p>
          <h3>Revenue by category</h3>
        </div>
        <span>Click to filter</span>
      </div>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              stroke={LINE}
              strokeOpacity={0.14}
              strokeDasharray="3 6"
              vertical={false}
            />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: TEXT }}
              axisLine={{ stroke: "#24454b" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCroreAxis}
              width={58}
              tick={{ fontSize: 11, fill: TEXT }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [formatINR(value), "Revenue"]}
              contentStyle={tooltipStyle()}
            />
            <Bar
              dataKey="revenue"
              radius={[3, 3, 0, 0]}
              isAnimationActive={false}
              cursor="pointer"
              onClick={(entry: any) =>
                onSelect(entry.payload.category as Category)
              }
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={
                    selected === "All" || selected === entry.category
                      ? BAR
                      : BAR_MUTED
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function StatusChart({
  data,
  selected,
  onSelect,
}: {
  data: { status: string; count: number }[];
  selected: "All" | OrderStatus;
  onSelect: (status: OrderStatus) => void;
}) {
  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <p>Operations</p>
          <h3>Order status</h3>
        </div>
        <span>Click to filter</span>
      </div>

      <div className="chart-box chart-box-pie">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              outerRadius={94}
              paddingAngle={2}
              isAnimationActive={false}
              cursor="pointer"
              onClick={(entry: any) =>
                onSelect(entry.status as OrderStatus)
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.status}
                  fill={
                    selected === "All" || selected === entry.status
                      ? STATUS[index % STATUS.length]
                      : "#284950"
                  }
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle()} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="legend-inline">
        {data.map((row, index) => (
          <button
            type="button"
            key={row.status}
            className={selected === row.status ? "selected" : ""}
            onClick={() => onSelect(row.status as OrderStatus)}
          >
            <i
              style={{
                background: STATUS[index % STATUS.length],
              }}
            />
            {row.status} {row.count.toLocaleString()}
          </button>
        ))}
      </div>
    </section>
  );
}

export function RegionChart({
  data,
  selected,
  onSelect,
}: {
  data: { region: string; revenue: number }[];
  selected: "All" | Region;
  onSelect: (region: Region) => void;
}) {
  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <p>Geography</p>
          <h3>Regional performance</h3>
        </div>
        <span>Click to filter</span>
      </div>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              stroke={LINE}
              strokeOpacity={0.14}
              strokeDasharray="3 6"
              horizontal={false}
            />
            <XAxis
              type="number"
              tickFormatter={formatCroreAxis}
              tick={{ fontSize: 11, fill: TEXT }}
              axisLine={{ stroke: "#24454b" }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="region"
              width={60}
              tick={{ fontSize: 12, fill: TEXT }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [formatINR(value), "Revenue"]}
              contentStyle={tooltipStyle()}
            />
            <Bar
              dataKey="revenue"
              radius={[0, 3, 3, 0]}
              isAnimationActive={false}
              cursor="pointer"
              onClick={(entry: any) =>
                onSelect(entry.payload.region as Region)
              }
            >
              {data.map((entry) => (
                <Cell
                  key={entry.region}
                  fill={
                    selected === "All" || selected === entry.region
                      ? BAR
                      : BAR_MUTED
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
