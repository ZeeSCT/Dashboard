"use client";

import {
  type PortfolioCategoryCode,
  useRevenueBillingSummary,
  useRevenueBillingProjects,
  type RevenueBillingProject,
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
import {
  useRevenueBillingSummary,
  useRevenueBillingProjects,
  RevenueBillingProject,
} from "@/lib/api";


function formatMoney(value?: number) {
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
type Tone = "g" | "w" | "d" | "";

interface KpiItem {
  label: string;
  value: string;
  subtext?: string;
  tone?: Tone;
}

function KpiCard({ item }: { item: KpiItem }) {
  return (
    <div className={`kc ${item.tone ?? ""}`.trim()}>
      <div className="kl">{item.label}</div>
      <div className="kv">{item.value}</div>
      {item.subtext ? <div className="ks">{item.subtext}</div> : null}
      {item.subtext && <div className="ks">{item.subtext}</div>}
    </div>
  );
}

function BillingKpis({
  summary,
  activeProjects,
}: {
  summary: Awaited<ReturnType<typeof useRevenueBillingSummary>>["data"];
  activeProjects: number;
}) {
  const kpis: KpiItem[] = summary
    ? [
        {
          label: "Contract value",
          value: formatMoney(summary.contractValue),
function BillingKpis() {
  const { data } = useRevenueBillingSummary();
  const { data: projects } = useRevenueBillingProjects();


const activeProjects = projects?.length ?? 0;

  const kpis: KpiItem[] = data
    ? [
        {
          label: "Contract value",
          value: formatMoney(data.contractValue),
          subtext: `${activeProjects} active projects`,
          tone: "g",
        },
        {
          label: "Invoiced to date",
          value: formatMoney(summary.invoicedToDate),
          subtext: `${summary.invoicedPct ?? 0}%`,
          value: formatMoney(data.invoicedToDate),
          subtext: `${data.invoicedPct ?? 0}%`,
          tone: "g",
        },
        {
          label: "Billing ready now",
          value: formatMoney(summary.billingReadyNow),
          subtext: `${summary.billingReadyProjects ?? 0} projects`,
          value: formatMoney(data.billingReadyNow),
          subtext: `${data.billingReadyProjects ?? 0} projects`,
          tone: "g",
        },
        {
          label: "Overdue receivables",
          value: formatMoney(summary.overdueReceivables),
          value: formatMoney(data.overdueReceivables),
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
function BillingTable() {
  const { data } = useRevenueBillingProjects();

  const rows: RevenueBillingProject[] = data ?? [];
  

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
  {rows.map((r) => (
    <tr key={r.projectId}>
      <td>{r.projectName}</td>

      <td>{formatMoney(r.contractValue)}</td>

      <td>{formatMoney(r.invoicedToDate)}</td>

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
              className={`bf ${
                r.tone === "g"
                  ? "bfg"
                  : r.tone === "w"
                  ? "bfa"
                  : "bfr"
              }`}
              style={{
                width: `${r.progressPct}%`,
              }}
            />
          </div>

          {r.progressPct}%
        </div>
      </td>

      <td
        style={{
          color:
            r.tone === "g"
              ? "var(--gn)"
              : r.tone === "w"
              ? "var(--am)"
              : "var(--rd)",
          fontWeight: 500,
        }}
      >
        {formatMoney(r.billingReadyAmount)}
      </td>

      <td>
        <span
          className={`b ${
            r.tone === "g"
              ? "bg2"
              : r.tone === "w"
              ? "ba"
              : "bgr"
          }`}
        >
          {r.status === "READY"
            ? "Ready"
            : r.status === "PARTIAL"
            ? "Partial"
            : "Not ready"}
        </span>
      </td>
    </tr>
  ))}
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
    error,
  } = useRevenueBillingSummary(category);

  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
  } = useRevenueBillingProjects(category);

  if (summaryLoading || projectsLoading) {
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

  if (summaryError || projectsError) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load revenue and billing data";

    return (
      <div className="scr on" id="screen-billing">
        <div className="cd">
          <div className="ch">Revenue & billing</div>
          <div style={{ color: "var(--rd)", fontSize: 13 }}>{message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="scr on" id="screen-billing">
      <BillingKpis summary={summary} activeProjects={projects.length} />
      <BillingTable rows={projects} />
export default function RevenueBilling() {
  return (
    <div className="scr on" id="screen-billing">
      <BillingKpis />
      <BillingTable />
    </div>
  );
}