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
      {item.subtext && <div className="ks">{item.subtext}</div>}
    </div>
  );
}

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
          value: formatMoney(data.invoicedToDate),
          subtext: `${data.invoicedPct ?? 0}%`,
          tone: "g",
        },
        {
          label: "Billing ready now",
          value: formatMoney(data.billingReadyNow),
          subtext: `${data.billingReadyProjects ?? 0} projects`,
          tone: "g",
        },
        {
          label: "Overdue receivables",
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

export default function RevenueBilling() {
  return (
    <div className="scr on" id="screen-billing">
      <BillingKpis />
      <BillingTable />
    </div>
  );
}