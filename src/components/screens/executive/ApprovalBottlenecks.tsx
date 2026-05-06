type Tone = "g" | "w" | "d" | "";

interface KpiItem {
  label: string;
  value: string;
  subtext?: string;
  tone?: Tone;
}

interface BottleneckItem {
  type: string;
  pending: number;
  width: number;
  tone: Tone;
}

interface OverdueItem {
  title: string;
  project: string;
  category: string;
  days: string;
  tone: Tone;
}

interface ApprovalRow {
  document: string;
  project: string;
  approver: string;
  submitted: string;
  days: string;
  status: "Overdue" | "At risk" | "Under review";
  tone: Tone;
}

// ---------------- KPI CARD ----------------
function KpiCard({ item }: { item: KpiItem }) {
  return (
    <div className={`kc ${item.tone ?? ""}`.trim()}>
      <div className="kl">{item.label}</div>
      <div className="kv">{item.value}</div>
      {item.subtext && <div className="ks">{item.subtext}</div>}
    </div>
  );
}

// ---------------- MAIN COMPONENT ----------------
export default function ApprovalBottlenecks() {
  const kpis: KpiItem[] = [
    { label: "Total pending", value: "37", subtext: "All projects", tone: "d" },
    { label: "Overdue (>7d)", value: "12", tone: "d" },
    { label: "Avg. approval time", value: "6.4d", subtext: "SLA: 3 days", tone: "w" },
    { label: "Approved this month", value: "58", subtext: "+12%", tone: "g" },
  ];

  const bottlenecks: BottleneckItem[] = [
    { type: "Client", pending: 14, width: 60, tone: "d" },
    { type: "Consultant", pending: 11, width: 45, tone: "w" },
    { type: "Authority", pending: 6, width: 25, tone: "w" },
    { type: "Internal", pending: 6, width: 25, tone: "g" },
  ];

  const overdue: OverdueItem[] = [
    { title: "Al Barsha MEP — IFC Drawing Rev.3", project: "Client", category: "18 days overdue", days: "18d", tone: "d" },
    { title: "DAFZA — Civil Method Statement", project: "Authority", category: "14 days overdue", days: "14d", tone: "d" },
    { title: "JLT Tower — Shop Drawing Set C", project: "Consultant", category: "11 days overdue", days: "11d", tone: "d" },
    { title: "DIP Warehouse — O&M Manual Draft", project: "Client", category: "8 days overdue", days: "8d", tone: "w" },
  ];

  const approvals: ApprovalRow[] = [
    { document: "IFC Drawing Rev.3", project: "Al Barsha MEP", approver: "Client (EMAAR)", submitted: "17 Mar 2026", days: "18d", status: "Overdue", tone: "d" },
    { document: "Civil Method Statement", project: "DAFZA Industrial", approver: "DM Authority", submitted: "22 Mar 2026", days: "14d", status: "Overdue", tone: "d" },
    { document: "Shop Drawing Set C", project: "JLT Tower", approver: "WSP Consultant", submitted: "25 Mar 2026", days: "11d", status: "Overdue", tone: "d" },
    { document: "O&M Manual Draft", project: "DIP Warehouse", approver: "Client (DP World)", submitted: "28 Mar 2026", days: "8d", status: "At risk", tone: "w" },
    { document: "Structural Calc. Pack", project: "Business Bay", approver: "Aurecon", submitted: "1 Apr 2026", days: "4d", status: "Under review", tone: "" },
    { document: "HSE Risk Assessment", project: "Mirdif Villa", approver: "Internal HSE", submitted: "2 Apr 2026", days: "3d", status: "Under review", tone: "" },
  ];

  return (
    <div className="scr on" id="screen-approvals">

      {/* KPI ROW */}
      <div className="kr">
        {kpis.map((k) => (
          <KpiCard key={k.label} item={k} />
        ))}
      </div>

      {/* 2-COLUMN GRID */}
      <div className="gr c2">

        {/* Bottleneck by approver */}
        <div className="cd">
          <div className="ch">Bottleneck by approver type</div>

          {bottlenecks.map((b) => (
            <div key={b.type} className="cbr">
              <span className="cbl">{b.type}</span>
              <div className="cbt">
                <div
                  className="cbi"
                  style={{
                    width: `${b.width}%`,
                    background:
                      b.tone === "d"
                        ? "var(--rbg)"
                        : b.tone === "w"
                        ? "var(--abg)"
                        : "var(--bbg)",
                    color:
                      b.tone === "d"
                        ? "var(--rt)"
                        : b.tone === "w"
                        ? "var(--at)"
                        : "var(--bt)",
                  }}
                >
                  {b.pending} pending
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Most overdue */}
        <div className="cd">
          <div className="ch">Most overdue</div>

          {overdue.map((o) => (
            <div key={o.title} className="tr2">
              <div
                className="td2"
                style={{
                  background: o.tone === "d" ? "var(--rd)" : "var(--am)",
                }}
              />
              <div>
                <div style={{ fontWeight: 500 }}>{o.title}</div>
                <div style={{ color: "var(--t2)", fontSize: 12 }}>
                  {o.project} — {o.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="cd">
        <div className="ch">All pending approvals</div>

        <table>
          <thead>
            <tr>
              <th>Document</th>
              <th>Project</th>
              <th>Approver</th>
              <th>Submitted</th>
              <th>Days pending</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {approvals.map((a) => (
              <tr key={a.document}>
                <td>{a.document}</td>
                <td>{a.project}</td>
                <td>{a.approver}</td>
                <td>{a.submitted}</td>

                <td style={{ color: a.tone === "d" ? "var(--rd)" : "var(--am)", fontWeight: 500 }}>
                  {a.days}
                </td>

                <td>
                  <span
                    className={`b ${
                      a.status === "Overdue"
                        ? "br"
                        : a.status === "At risk"
                        ? "ba"
                        : "bb"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}