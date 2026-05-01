"use client";

import { useState } from "react";
import {
  ApiError,
  DocumentationOverdueApproval,
  DocumentationRegisterItem,
  DocumentationStage,
  DocumentationStatusLabel,
  DocumentationStatusSummaryItem,
  PortfolioCategoryCode,
  useDocumentationStatus,
} from "@/lib/api";

type DocumentationStatusProps = {
  selectedPortfolioCategory?: PortfolioCategoryCode;
};

type StageTab = {
  key: DocumentationStage;
  label: string;
};

const tabs: StageTab[] = [
  { key: "pre-construction", label: "Pre-construction" },
  { key: "design", label: "Design" },
  { key: "procurement", label: "Procurement" },
  { key: "construction", label: "Construction" },
  { key: "testing-commissioning", label: "Testing & commissioning" },
  { key: "closeout", label: "Closeout" },
];

const badgeClassByStatus: Record<DocumentationStatusLabel, string> = {
  Approved: "bg2",
  "Under review": "bb",
  "In preparation": "bgr",
  Overdue: "br",
  Rejected: "br",
  "At risk": "ba",
};

const progressClassByStatus: Partial<Record<DocumentationStatusLabel, string>> =
  {
    Approved: "bfg",
    "Under review": "bfb",
    Overdue: "bfr",
    Rejected: "bfr",
    "At risk": "bfa",
  };

export default function DocumentationStatus({
  selectedPortfolioCategory = "all",
}: DocumentationStatusProps) {
  const [activeStage, setActiveStage] =
    useState<DocumentationStage>("pre-construction");

  const { data, isLoading, isError, error } = useDocumentationStatus(
    selectedPortfolioCategory,
    activeStage
  );

  const kpis = data?.kpis ?? {
    totalDocuments: 0,
    approved: 0,
    underReview: 0,
    overdue: 0,
    inPreparation: 0,
    rejected: 0,
    atRisk: 0,
  };

  const statusSummary = data?.statusSummary ?? [];
  const overdueApprovals = data?.overdueApprovals ?? [];
  const register = data?.register ?? [];

  if (isLoading) {
    return (
      <div className="html-screen">
        <div className="scr on" id="screen-docstatus">
          <DocumentationTabs
            activeStage={activeStage}
            onStageChange={setActiveStage}
          />

          <div className="cd">
            <div className="ch">Documentation status</div>
            <div className="ks">Loading documentation status data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const message =
      error instanceof ApiError || error instanceof Error
        ? error.message
        : "Failed to load documentation status.";

    return (
      <div className="html-screen">
        <div className="scr on" id="screen-docstatus">
          <DocumentationTabs
            activeStage={activeStage}
            onStageChange={setActiveStage}
          />

          <div className="cd">
            <div className="ch">Documentation status</div>
            <div className="ks" style={{ color: "var(--rd)" }}>
              {message}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="html-screen">
      <div className="scr on" id="screen-docstatus">
        <DocumentationTabs
          activeStage={activeStage}
          onStageChange={setActiveStage}
        />

        <section className="kr">
          <MetricCard
            label="Total documents"
            value={kpis.totalDocuments}
            subtext={data?.selectedCategoryLabel ?? "Selected portfolio"}
          />

          <MetricCard
            label="Approved"
            value={kpis.approved}
            subtext={`${getPercent(kpis.approved, kpis.totalDocuments)}%`}
            tone="g"
          />

          <MetricCard
            label="Under review"
            value={kpis.underReview}
            subtext={`${getPercent(kpis.underReview, kpis.totalDocuments)}%`}
            tone="w"
          />

          <MetricCard
            label="Overdue"
            value={kpis.overdue}
            subtext={`${getPercent(kpis.overdue, kpis.totalDocuments)}%`}
            tone="d"
          />

          <MetricCard
            label="In preparation"
            value={kpis.inPreparation}
            subtext={`${getPercent(
              kpis.inPreparation,
              kpis.totalDocuments
            )}%`}
          />
        </section>

        <section className="gr c2">
          <StatusSummaryCard statusSummary={statusSummary} />

          <OverdueApprovalsCard overdueApprovals={overdueApprovals} />
        </section>

        <DocumentRegisterTable
          register={register}
          selectedCategoryLabel={data?.selectedCategoryLabel ?? "Selected portfolio"}
        />
      </div>
    </div>
  );
}

function DocumentationTabs({
  activeStage,
  onStageChange,
}: {
  activeStage: DocumentationStage;
  onStageChange: (stage: DocumentationStage) => void;
}) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`tab ${activeStage === tab.key ? "on" : ""}`}
          onClick={() => onStageChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtext,
  tone = "",
}: {
  label: string;
  value: string | number;
  subtext?: string;
  tone?: "g" | "w" | "d" | "";
}) {
  return (
    <div className={`kc ${tone}`.trim()}>
      <div className="kl">{label}</div>
      <div className="kv">{value}</div>
      {subtext ? <div className="ks">{subtext}</div> : null}
    </div>
  );
}

function StatusSummaryCard({
  statusSummary,
}: {
  statusSummary: DocumentationStatusSummaryItem[];
}) {
  return (
    <div className="cd">
      <div className="ch">Status summary</div>

      {statusSummary.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {statusSummary.map((item) => (
            <div key={item.label}>
              <div className="pl">
                <span>{item.label}</span>
                <span style={{ fontWeight: 500 }}>{item.value}</span>
              </div>

              <div className="bw">
                <div
                  className={`bf ${progressClassByStatus[item.label] ?? ""}`}
                  style={getProgressBarStyle(item.label, item.percent)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ks">No document status data found.</div>
      )}
    </div>
  );
}

function OverdueApprovalsCard({
  overdueApprovals,
}: {
  overdueApprovals: DocumentationOverdueApproval[];
}) {
  return (
    <div className="cd">
      <div className="ch">Overdue approvals</div>

      {overdueApprovals.length > 0 ? (
        overdueApprovals.map((item) => (
          <div className="tr2" key={item.id}>
            <div
              className="td2"
              style={{
                background:
                  item.severity === "danger" ? "var(--rd)" : "var(--am)",
              }}
            />

            <div>
              <div style={{ fontWeight: 500 }}>{item.title}</div>

              <div
                style={{
                  color: "var(--t2)",
                  fontSize: 12,
                }}
              >
                {item.days} days — {item.approver}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="tr2">
          <div
            className="td2"
            style={{
              background: "var(--gn)",
            }}
          />

          <div>
            <div style={{ fontWeight: 500 }}>No overdue approvals</div>
            <div
              style={{
                color: "var(--t2)",
                fontSize: 12,
              }}
            >
              Selected portfolio and stage are currently clear
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentRegisterTable({
  register,
  selectedCategoryLabel,
}: {
  register: DocumentationRegisterItem[];
  selectedCategoryLabel: string;
}) {
  return (
    <div className="cd">
      <div className="ch">
        Document register <span>{selectedCategoryLabel}</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Document</th>
            <th>Project</th>
            <th>Rev.</th>
            <th>Submitted</th>
            <th>Approver</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {register.map((item) => (
            <tr key={item.id}>
              <td>{item.document}</td>
              <td>{item.project}</td>
              <td>{item.revision}</td>
              <td>{item.submitted}</td>
              <td>{item.approver}</td>
              <td>
                <span className={`b ${badgeClassByStatus[item.status]}`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}

          {register.length === 0 && (
            <tr>
              <td colSpan={6}>
                No documents found for this stage and portfolio category.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function getPercent(value: number, total: number) {
  if (total === 0) return 0;

  return Math.round((value / total) * 100);
}

function getProgressBarStyle(
  status: DocumentationStatusLabel,
  percent: number
) {
  if (status === "In preparation") {
    return {
      width: `${percent}%`,
      background: "#888780",
    };
  }

  return {
    width: `${percent}%`,
  };
}