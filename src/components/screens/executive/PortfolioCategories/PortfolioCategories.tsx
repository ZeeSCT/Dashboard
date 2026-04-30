"use client";

import { useState } from "react";
import {
  getPortfolioCategories,
  createPortfolioCategory,
  updatePortfolioCategory,
  deletePortfolioCategory,
} from "@/lib/api";

import "./portfolio-categories.css";

export default function PortfolioCategoriesPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = getPortfolioCategories({
    page: 1,
    limit: 100,
    search,
  });

  const items = data?.data ?? [];

  const createMutation = createPortfolioCategory();
  const updateMutation = updatePortfolioCategory();
  const deleteMutation = deletePortfolioCategory();

  /* ================= KPI ================= */
  const total = items.length;
  const active = items.filter((x) => x.isActive).length;
  const inactive = total - active;
  const completion = total ? Math.round((active / total) * 100) : 0;

  return (
    <div className="scr on" id="screen-portfolio">

      {/* ================= KPI ROW ================= */}
      <div className="kr">
        <div className="kc g">
          <div className="kl">Active projects</div>
          <div className="kv">{total}</div>
          <div className="ks">Total categories</div>
        </div>

        <div className="kc">
          <div className="kl">Completion</div>
          <div className="kv">{completion}%</div>
          <div className="ks">Active ratio</div>
        </div>

        <div className="kc w">
          <div className="kl">Inactive</div>
          <div className="kv">{inactive}</div>
          <div className="ks">Needs attention</div>
        </div>

        <div className="kc d">
          <div className="kl">Active</div>
          <div className="kv">{active}</div>
          <div className="ks">Healthy items</div>
        </div>
      </div>

      {/* ================= SEARCH + CREATE ================= */}
      <div className="cd">
        <div className="ch">
          Portfolio Categories
        </div>

        <div className="pc-row-actions">
          <input
            className="pc-search"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="pc-btn primary"
            onClick={() =>
              createMutation.mutate({
                name: "New Category",
                isActive: true,
              })
            }
          >
            Create
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="cd">
        <div className="ch">
          Category List <span>{total}</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4}>Loading...</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.slug}</td>

                  <td>
                    <span className={`b ${item.isActive ? "bg2" : "bg3"}`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="pc-row-actions">
                    <button
                      onClick={() =>
                        updateMutation.mutate({
                          id: item.id,
                          payload: {
                            isActive: !item.isActive,
                          },
                        })
                      }
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() =>
                        deleteMutation.mutate(item.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}