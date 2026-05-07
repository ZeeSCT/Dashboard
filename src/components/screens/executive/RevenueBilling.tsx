"use client";

import {
  type PortfolioCategoryCode,
  type RevenueBillingProject,
  type RevenueBillingSummary,
  useRevenueBillingProjects,
  useRevenueBillingSummary,
} from "@/lib/api";

type RevenueBillingProps = {
  selectedPortfolioCategory?: PortfolioCategoryCode;
};

type Tone = "g" | "w" | "d" | "";

interface KpiItem {
  label: string;
  value: string;
  subtext?: string;
  tone?: Tone;
}

function formatMoney(value?: number | null) {
  if (!value) return "AED 0";

  const million = value / 1_000_000;

  if (million >= 1) {
    return `AED ${million.toFixed(1)}M`;
  }

  return `AED ${(value / 1_000).toFixed(0)}K`;
}

function getProgressClass(tone?: string) {
  if (tone === "g") return "bf bfg";
  if (tone === "w") return "bf bfa";
  return "bf bfr";
}

function getBillingReadyColor(tone?: string) {
  if (tone === "g") return "var(--gn)";
  if (tone === "w") return "var(--am)";
  return "var(--rd)";
}

function getStatusBadgeClass(tone?: string) {
  if (tone === "g") return "b bg2";
  if (tone === "w") return "b ba";
  return "b bgr";
}

function getStatusLabel(status: string) {
  if (status === "READY") return "Ready";
  if (status === "PARTIAL") return "Partial";
  return "Not ready";
}

function KpiCard({ item }: { item: KpiItem }) {
  return (
    <div className={`kc ${item.tone ?? ""}`.trim()}>
      <div className="kl">{item.label}</div>
      <div className="kv">{item.value}</div>
      {item.subtext ? <div className="ks">{item.subtext}</div> : null}
    </div>
  );
}

function BillingKpis({
  summary,
  activeProjects,
}: {
  summary?: RevenueBillingSummary;
  activeProjects: number;
}) {
  const kpis: KpiItem[] = summary
    ? [
        {
          label: "Contract value",
          value: formatMoney(summary.contractValue),
          subtext: `${activeProjects} active projects`,
          tone: "g",
        },
        {
          label: "Invoiced to date",
          value: formatMoney(summary.invoicedToDate),
          subtext: `${summary.invoicedPct ?? 0}%`,
          tone: "g",
        },
        {
          label: "Billing ready now",
          value: formatMoney(summary.billingReadyNow),
          subtext: `${summary.billingReadyProjects ?? 0} projects`,
          tone: "g",
        },
        {
          label: "Overdue receivables",
          value: formatMoney(summary.overdueReceivables),
          tone: "d",
        },
      ]
    : [];

  return (
    <div className="kr">
      {kpis.map((item) => (
        <KpiCard key={item.label} item={item} />
      ))}
    </div>
  );
}

function BillingTable({ rows }: { rows: RevenueBillingProject[] }) {
  return (
    <div className="cd">
      <div className="ch">Billing readiness by project</div>

      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Contract value</th>
            <th>Invoiced</th>
            <th>Progress</th>
            <th>Billing ready</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.length ? (
            rows.map((row) => (
              <tr key={row.projectId}>
                <td>{row.projectName}</td>
                <td>{formatMoney(row.contractValue)}</td>
                <td>{formatMoney(row.invoicedToDate)}</td>

                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <div className="bw">
                      <div
                        className={getProgressClass(row.tone)}
                        style={{
                          width: `${row.progressPct}%`,
                        }}
                      />
                    </div>

                    {row.progressPct}%
                  </div>
                </td>

                <td
                  style={{
                    color: getBillingReadyColor(row.tone),
                    fontWeight: 500,
                  }}
                >
                  {formatMoney(row.billingReadyAmount)}
                </td>

                <td>
                  <span className={getStatusBadgeClass(row.tone)}>
                    {getStatusLabel(row.status)}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ color: "var(--t2)", fontSize: 13 }}>
                No billing data found for this portfolio.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function RevenueBilling({
  selectedPortfolioCategory = "all",
}: RevenueBillingProps) {
  const category = selectedPortfolioCategory;

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErrorData,
  } = useRevenueBillingSummary(category);

  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
    error: projectsErrorData,
  } = useRevenueBillingProjects(category);

  const isLoading = summaryLoading || projectsLoading;
  const isError = summaryError || projectsError;

  const error =
    summaryErrorData instanceof Error
      ? summaryErrorData
      : projectsErrorData instanceof Error
        ? projectsErrorData
        : null;

  if (isLoading) {
    return (
      <div className="scr on" id="screen-billing">
        <div className="cd">
          <div className="ch">Revenue & billing</div>
          <div style={{ color: "var(--t2)", fontSize: 13 }}>
            Loading revenue and billing data...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="scr on" id="screen-billing">
        <div className="cd">
          <div className="ch">Revenue & billing</div>
          <div style={{ color: "var(--rd)", fontSize: 13 }}>
            {error?.message ?? "Unable to load revenue and billing data"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scr on" id="screen-billing">
      <BillingKpis summary={summary} activeProjects={projects.length} />
      <BillingTable rows={projects} />
    </div>
  );
}