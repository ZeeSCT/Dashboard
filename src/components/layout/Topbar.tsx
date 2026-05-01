"use client";

import { screenTitles, type ScreenKey } from "@/data/screens";
import {
  portfolioCategoryOptions,
  type PortfolioCategory,
} from "@/data/portfolio";

type TopbarProps = {
  active: ScreenKey;
  selectedPortfolioCategory: PortfolioCategory;
  onPortfolioCategoryChange: (category: PortfolioCategory) => void;
};

export default function Topbar({
  active,
  selectedPortfolioCategory,
  onPortfolioCategoryChange,
}: TopbarProps) {
  return (
    <div className="bar">
      <span className="bar-title" id="ttl">
        {screenTitles[active]}
      </span>

      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <span
          className="bbd"
          style={{
            display: active.startsWith("tender") ? "none" : "inline-block",
          }}
        >
          PM &amp; Engineer
        </span>

        <span
          className="bbd"
          style={{
            display: active.startsWith("tender") ? "inline-block" : "none",
            background: "var(--pbg)",
            color: "var(--pt)",
          }}
        >
          Tender
        </span>
      </div>

      <div className="bar-search">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          id="global-search"
          placeholder="Search all portfolios..."
        />

        <span className="bar-kbd">Ctrl+K</span>
      </div>

      <div className="bar-gap" />

      <select
        className="bar-drop"
        id="port-filter"
        value={selectedPortfolioCategory}
        onChange={(e) =>
          onPortfolioCategoryChange(e.target.value as PortfolioCategory)
        }
      >
        {portfolioCategoryOptions.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      <button className="bar-pill on" id="btn-allport">
        {
          portfolioCategoryOptions.find(
            (category) => category.value === selectedPortfolioCategory
          )?.label
        }
      </button>

      <button className="bar-export">Export</button>
    </div>
  );
}