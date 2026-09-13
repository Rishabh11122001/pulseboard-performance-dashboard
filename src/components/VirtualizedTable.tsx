import { useMemo, useState } from "react";
import type { Transaction } from "../types";
import { formatINR } from "../utils";

interface Props {
  rows: Transaction[];
  totalMatches: number;
}

const ROW_HEIGHT = 46;
const VIEWPORT_HEIGHT = 410;
const OVERSCAN = 8;

export function VirtualizedTable({ rows, totalMatches }: Props) {
  const [scrollTop, setScrollTop] = useState(0);

  const visible = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
    const count = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT) + OVERSCAN * 2;
    const end = Math.min(rows.length, start + count);

    return {
      start,
      end,
      rows: rows.slice(start, end),
      offsetY: start * ROW_HEIGHT,
    };
  }, [rows, scrollTop]);

  return (
    <section className="table-panel">
      <div className="table-intro">
        <div>
          <div className="section-kicker">Transaction sample</div>
          <h3>
            {rows.length.toLocaleString()} displayed of{" "}
            {totalMatches.toLocaleString()} matching records
          </h3>
          <p>
            Full data is used for analytics. The table intentionally caps the
            preview because scrolling through hundreds of thousands of rows is
            not useful analysis.
          </p>
        </div>

        <div className="dom-counter">
          <strong>{visible.end - visible.start}</strong>
          <span>DOM rows</span>
        </div>
      </div>

      <div className="table-grid table-columns table-labels">
        <span>Order</span>
        <span>Date</span>
        <span>Region</span>
        <span>Category</span>
        <span>Status</span>
        <span className="right">Revenue</span>
      </div>

      <div
        className="virtual-scroll"
        style={{ height: VIEWPORT_HEIGHT }}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <div
          style={{
            height: rows.length * ROW_HEIGHT,
            position: "relative",
          }}
        >
          <div
            style={{
              transform: `translateY(${visible.offsetY}px)`,
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
            }}
          >
            {visible.rows.map((row) => (
              <div
                className="table-grid table-columns data-row"
                style={{ height: ROW_HEIGHT }}
                key={row.id}
              >
                <span className="mono">{row.orderId}</span>
                <span>{row.date}</span>
                <span>{row.region}</span>
                <span>{row.category}</span>
                <span>{row.status}</span>
                <span className="right">{formatINR(row.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
