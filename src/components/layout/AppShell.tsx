"use client";

import { useState } from "react";
import type { ComponentType } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { pageRegistry } from "@/lib/pageRegistry";
import type { ScreenKey } from "@/data/screens";
import type { PortfolioCategory } from "@/data/portfolio";

export default function AppShell() {
  const [active, setActive] = useState<ScreenKey>("portfolio");

  const [selectedPortfolioCategory, setSelectedPortfolioCategory] =
    useState<PortfolioCategory>("all");

  const ActiveScreen = pageRegistry[active] as ComponentType<{
    selectedPortfolioCategory?: PortfolioCategory;
  }>;

  return (
    <div className="shell">
      <Sidebar active={active} onChange={setActive} />

      <div className="main">
        <Topbar
          active={active}
          selectedPortfolioCategory={selectedPortfolioCategory}
          onPortfolioCategoryChange={setSelectedPortfolioCategory}
        />

        <div className="cnt">
          <ActiveScreen
            selectedPortfolioCategory={selectedPortfolioCategory}
          />
        </div>
      </div>
    </div>
  );
}