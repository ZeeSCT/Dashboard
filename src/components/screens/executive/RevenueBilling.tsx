import {
  useRevenueBillingSummary,
  useRevenueBillingProjects,
} from "@/lib/api";

type Tone = "g" | "w" | "d" | "";

interface KpiItem {
  label: string;
  value: string;
  subtext?: string;
  tone?: Tone;
}

interface BillingProject {
  projectName: string;
  contractValue: string;
  invoiced: string;
  progress: number;
  billingReady: string;
  status: "Ready" | "Partial" | "Not ready";
  tone: Tone;
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

  const kpis: KpiItem[] = data ?? [];

  return (
    <div className="kr">
      {kpis.map((item) => (
        <KpiCard key={item.label} item={item} />
      ))}
    </div>
  );
}

function BillingTable() {
  // ✅ FIX: use correct hook name
  const { data } = useRevenueBillingProjects();

  const rows: BillingProject[] = data ?? [];

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
            <tr key={r.projectName}>
              <td>{r.projectName}</td>
              <td>{r.contractValue}</td>
              <td>{r.invoiced}</td>

              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div className="bw">
                    <div
                      className="bf"
                      style={{ width: `${r.progress}%` }}
                    />
                  </div>
                  {r.progress}%
                </div>
              </td>

              <td
                style={{
                  color:
                    r.tone === "g"
                      ? "var(--gn)"
                      : r.tone === "w"
                      ? "var(--am)"
                      : "var(--t3)",
                  fontWeight: 500,
                }}
              >
                {r.billingReady}
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
                  {r.status}
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