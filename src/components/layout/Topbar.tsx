"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { screenTitles, type ScreenKey } from "@/data/screens";
import {
  portfolioCategoryOptions,
  type PortfolioCategory,
} from "@/data/portfolio";
import { useAuth } from "@/context/AuthContext";

type TopbarProps = {
  active: ScreenKey;
  selectedPortfolioCategory: PortfolioCategory;
  onPortfolioCategoryChange: (category: PortfolioCategory) => void;
};


function getInitials(name?: string | null, email?: string | null): string {
  const source = name?.trim() || email?.trim() || "User";

  const parts = source.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export default function Topbar({
  active,
  selectedPortfolioCategory,
  onPortfolioCategoryChange,
}: TopbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout(): void {
    logout();
    setUserMenuOpen(false);
    router.replace("/login");
  }

  // return (
  //   <div className="bar">
  //     <span className="bar-title" id="ttl">
  //       {screenTitles[active]}
  //     </span>

  //     <div
  //       style={{
  //         display: "flex",
  //         gap: 6,
  //         alignItems: "center",
  //         flexShrink: 0,
  //       }}
  //     >
        

  //       <span
  //         className="bbd"
  //         style={{
  //           display: active.startsWith("tender") ? "inline-block" : "none",
  //           background: "var(--pbg)",
  //           color: "var(--pt)",
  //         }}
  //       >
  //         Tender
  //       </span>
  //     </div>
      
  //     <div className="bar-gap" />

  //     <div className="bar-search">
  //       <svg
  //         width="14"
  //         height="14"
  //         viewBox="0 0 24 24"
  //         fill="none"
  //         stroke="currentColor"
  //         strokeWidth="2"
  //       >
  //         <circle cx="11" cy="11" r="8" />
  //         <line x1="21" y1="21" x2="16.65" y2="16.65" />
  //       </svg>

  //       <input
  //         type="text"
  //         id="global-search"
  //         placeholder="Search all portfolios..."
  //       />

  //       <span className="bar-kbd">Ctrl+K</span>
  //     </div>

  //     <div className="bar-gap" />

  //     <select
  //       className="bar-drop"
  //       id="port-filter"
  //       value={selectedPortfolioCategory}
  //       onChange={(e) =>
  //         onPortfolioCategoryChange(e.target.value as PortfolioCategory)
  //       }
  //     >
  //       {portfolioCategoryOptions.map((category) => (
  //         <option key={category.value} value={category.value}>
  //           {category.label}
  //         </option>
  //       ))}
  //     </select>

  //     <div className="user-menu" ref={userMenuRef}>
  //       <button
  //         type="button"
  //         className="user-menu-trigger"
  //         onClick={() => setUserMenuOpen((current) => !current)}
  //         aria-label="User menu"
  //         aria-expanded={userMenuOpen}
  //       >
  //         <span className="user-avatar">
  //           {getInitials(user?.name, user?.email)}
  //         </span>
  //       </button>

  //       {userMenuOpen ? (
  //         <div className="user-menu-panel">
  //           <div className="user-menu-head">
  //             <div className="user-menu-name">{user?.name || "User"}</div>
  //             <div className="user-menu-email">{user?.email || ""}</div>
  //           </div>

  //           <button
  //             type="button"
  //             className="user-menu-logout"
  //             onClick={handleLogout}
  //           >
  //             Logout
  //           </button>
  //         </div>
  //       ) : null}
  //     </div>
  //   </div>
  // );

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
          display: active.startsWith("tender") ? "inline-block" : "none",
          background: "var(--pbg)",
          color: "var(--pt)",
        }}
      >
        Tender
      </span>
    </div>

    <div className="bar-gap" />

    <div className="bar-actions">
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

      <div className="user-menu" ref={userMenuRef}>
        <button
          type="button"
          className="user-menu-trigger"
          onClick={() => setUserMenuOpen((current) => !current)}
          aria-label="User menu"
          aria-expanded={userMenuOpen}
        >
          <span className="user-avatar">
            {getInitials(user?.name, user?.email)}
          </span>
        </button>

        {userMenuOpen ? (
          <div className="user-menu-panel">
            <div className="user-menu-head">
              <div className="user-menu-name">{user?.name || "User"}</div>
              <div className="user-menu-email">{user?.email || ""}</div>
            </div>

            <button
              type="button"
              className="user-menu-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

}