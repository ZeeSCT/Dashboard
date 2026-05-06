"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ApiError,
  type DocumentationOverdueApproval,
  type DocumentationRegisterItem,
  type DocumentationStage,
  type DocumentationStatusLabel,
  type DocumentationStatusSeverity,
  type DocumentationStatusSummaryItem,
  type PortfolioCategoryCode,
  useDocumentationStatus,
  useExecutiveLookups,
} from "@/lib/api";

type DocumentationStatusProps = {
  selectedPortfolioCategory?: PortfolioCategoryCode;
};

type StageTab = {
  key: DocumentationStage;
  label: string;
};

const fallbackTabs: StageTab[] = [
  { key: "pre-construction", label: "Pre-construction" },
  { key: "design", label: "Design" },
  { key: "procurement", label: "Procurement" },
  { key: "construction", label: "Construction" },
  { key: "testing-commissioning", label: "Testing & commissioning" },
  { key: "closeout", label: "Closeout" },
];

function getSeverityFromStatus(
  status?: DocumentationStatusLabel | string,
  code?: string,
  severity?: DocumentationStatusSeverity,
): DocumentationStatusSeverity {
  if (severity) return severity;

  const key = (code || status || "").toLowerCase();

  if (key.includes("approved")) return "success";

  if (key.includes("under-review") || key.includes("under review")) {
    return "info";
  }

  if (key.includes("at-risk") || key.includes("at risk")) {
    return "warning";
  }

  if (key.includes("overdue") || key.includes("rejected")) {
    return "danger";
  }

  if (key.includes("in-preparation") || key.includes("in preparation")) {
    return "neutral";
  }

  return "neutral";
}

function getBadgeClassBySeverity(severity?: DocumentationStatusSeverity) {
  switch (severity) {
    case "success":
      return "bg2";

    case "info":
      return "bb";

    case "warning":
      return "ba";

    case "danger":
      return "br";

    case "neutral":
      return "bgr";

    default:
      return "bgr";
  }
}

function getProgressClassBySeverity(severity?: DocumentationStatusSeverity) {
  switch (severity) {
    case "success":
      return "bfg";

    case "info":
      return "bfb";

    case "warning":
      return "bfa";

    case "danger":
      return "bfr";

    default:
      return "";
  }
}

function getProgressColorBySeverity(severity?: DocumentationStatusSeverity) {
  switch (severity) {
    case "success":
      return "var(--gn)";

    case "info":
      return "var(--bl)";

    case "warning":
      return "var(--am)";

    case "danger":
      return "var(--rd)";

    case "neutral":
      return "#888780";

    default:
      return "#888780";
  }
}

export default function DocumentationStatus({
  selectedPortfolioCategory = "all",
}: DocumentationStatusProps) {
  const [activeStage, setActiveStage] =
    useState<DocumentationStage>("pre-construction");

  const { data: lookups } = useExecutiveLookups();

  const tabs = useMemo<StageTab[]>(() => {
    const stages = lookups?.documentationStages ?? [];

    if (!stages.length) return fallbackTabs;

    return stages.map((stage) => ({
      key: stage.code,
      label: stage.label,
    }));
  }, [lookups?.documentationStages]);

  useEffect(() => {
    const exists = tabs.some((tab) => tab.key === activeStage);

    if (!exists && tabs[0]) {
      setActiveStage(tabs[0].key);
    }
  }, [tabs, activeStage]);

  const { data, isLoading, isError, error } = useDocumentationStatus(
    selectedPortfolioCategory,
    activeStage,
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
            tabs={tabs}
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
            tabs={tabs}
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
          tabs={tabs}
          activeStage={activeStage}
          onStageChange={setActiveStage}
        />

        <section className="kr">
          <MetricCard
            label="Total documents"
            value={kpis.totalDocuments ?? 0}
            subtext={data?.selectedCategoryLabel ?? "Selected portfolio"}
          />

          <MetricCard
            label="Approved"
            value={kpis.approved ?? 0}
            subtext={`${getPercent(
              kpis.approved ?? 0,
              kpis.totalDocuments ?? 0,
            )}%`}
            tone="g"
          />

          <MetricCard
            label="Under review"
            value={kpis.underReview ?? 0}
            subtext={`${getPercent(
              kpis.underReview ?? 0,
              kpis.totalDocuments ?? 0,
            )}%`}
            tone="w"
          />

          <MetricCard
            label="Overdue"
            value={kpis.overdue ?? 0}
            subtext={`${getPercent(
              kpis.overdue ?? 0,
              kpis.totalDocuments ?? 0,
            )}%`}
            tone="d"
          />

          <MetricCard
            label="In preparation"
            value={kpis.inPreparation ?? 0}
            subtext={`${getPercent(
              kpis.inPreparation ?? 0,
              kpis.totalDocuments ?? 0,
            )}%`}
          />
        </section>

        <section className="gr c2">
          <StatusSummaryCard statusSummary={statusSummary} />

          <OverdueApprovalsCard overdueApprovals={overdueApprovals} />
        </section>

        <DocumentRegisterTable
          register={register}
          selectedCategoryLabel={
            data?.selectedCategoryLabel ?? "Selected portfolio"
          }
        />
      </div>
    </div>
  );
}

function DocumentationTabs({
  tabs,
  activeStage,
  onStageChange,
}: {
  tabs: StageTab[];
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
          {statusSummary.map((item) => {
            const severity = getSeverityFromStatus(
              item.label,
              item.code,
              item.severity,
            );

            return (
              <div key={item.code ?? item.label}>
                <div className="pl">
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 500 }}>{item.value}</span>
                </div>

                <div className="bw">
                  <div
                    className={`bf ${getProgressClassBySeverity(
                      severity,
                    )}`.trim()}
                    style={getProgressBarStyle(item.percent, severity)}
                  />
                </div>
              </div>
            );
          })}
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
        overdueApprovals.map((item) => {
          const severity = getSeverityFromStatus(
            item.status,
            item.statusCode,
            item.severity,
          );

          return (
            <div className="tr2" key={item.id}>
              <div
                className="td2"
                style={{
                  background:
                    severity === "danger" ? "var(--rd)" : "var(--am)",
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
          );
        })
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
          {register.length > 0 ? (
            register.map((item) => {
              const severity = getSeverityFromStatus(
                item.status,
                item.statusCode,
                item.statusSeverity,
              );

              return (
                <tr key={item.id}>
                  <td>{item.document}</td>
                  <td>{item.project}</td>
                  <td>{item.revision}</td>
                  <td>{item.submitted}</td>
                  <td>{item.approver}</td>
                  <td>
                    <span className={`b ${getBadgeClassBySeverity(severity)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
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
  percent: number,
  severity?: DocumentationStatusSeverity,
) {
  return {
    width: `${percent}%`,
    background: getProgressColorBySeverity(severity),
  };
}