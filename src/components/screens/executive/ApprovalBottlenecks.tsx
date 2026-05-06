"use client";

import { useMemo } from "react";
import {
  ApprovalBottleneckApproverType,
  ApprovalBottleneckItem,
  ApprovalBottleneckPendingApproval,
  ApprovalBottleneckStatus,
  PortfolioCategoryCode,
  useApprovalBottlenecks,
} from "@/lib/api";

interface ApprovalBottlenecksProps {
  selectedPortfolioCategory?: PortfolioCategoryCode;
}

interface ApprovalBottlenecksKpiCard {
  label: string;
  value: string | number;
  subtext?: string;
  tone?: "g" | "w" | "d";
}

function getBadgeClass(status: ApprovalBottleneckStatus) {
  switch (status) {
    case "Overdue":
      return "b br";

    case "At risk":
      return "b ba";

    case "Under review":
      return "b bb";

    default:
      return "b bb";
  }
}

function getKpiClass(tone?: ApprovalBottlenecksKpiCard["tone"]) {
  return tone ? `kc ${tone}` : "kc";
}

function getApproverBarColor(approverType: ApprovalBottleneckApproverType) {
  switch (approverType) {
    case "Client":
      return {
        background: "var(--rbg)",
        color: "var(--rt)",
      };

    case "Consultant":
    case "Authority":
      return {
        background: "var(--abg)",
        color: "var(--at)",
      };

    case "Internal":
      return {
        background: "var(--bbg)",
        color: "var(--bt)",
      };

    default:
      return {
        background: "var(--bbg)",
        color: "var(--bt)",
      };
  }
}

function getOverdueDotColor(daysOverdue: number) {
  if (daysOverdue > 10) return "var(--rd)";
  return "var(--am)";
}

function getDaysPendingStyle(status: ApprovalBottleneckStatus) {
  switch (status) {
    case "Overdue":
      return {
        color: "var(--rd)",
        fontWeight: 500,
      };

    case "At risk":
      return {
        color: "var(--am)",
        fontWeight: 500,
      };

    default:
      return {};
  }
}

function formatAverageDays(value: number) {
  return `${value.toFixed(1)}d`;
}

export default function ApprovalBottlenecks({
  selectedPortfolioCategory = "all",
}: ApprovalBottlenecksProps) {
  const category = selectedPortfolioCategory;

  const { data, isLoading, isError, error } =
    useApprovalBottlenecks(category);

  const kpis = useMemo<ApprovalBottlenecksKpiCard[]>(() => {
    if (!data) return [];

    return [
      {
        label: "Total pending",
        value: data.kpis.totalPending,
        subtext: category === "all" ? "All projects" : "Selected portfolio",
        tone: data.kpis.totalPending > 0 ? "d" : "g",
      },
      {
        label: "Overdue (>7d)",
        value: data.kpis.overdueCount,
        tone: data.kpis.overdueCount > 0 ? "d" : "g",
      },
      {
        label: "Avg. approval time",
        value: formatAverageDays(data.kpis.averageApprovalTimeDays),
        subtext: "SLA: 3 days",
        tone:
          data.kpis.averageApprovalTimeDays > 7
            ? "d"
            : data.kpis.averageApprovalTimeDays > 3
              ? "w"
              : "g",
      },
      {
        label: "Approved this month",
        value: data.kpis.approvedThisMonth,
        subtext:
          data.kpis.approvedThisMonthChangePct >= 0
            ? `+${data.kpis.approvedThisMonthChangePct}%`
            : `${data.kpis.approvedThisMonthChangePct}%`,
      },
    ];
  }, [data, category]);

  if (isLoading) {
    return (
      <div className="scr on" id="screen-approvals">
        <div className="cd">
          <div className="ch">Approval bottlenecks</div>
          <div style={{ color: "var(--t2)", fontSize: 13 }}>
            Loading approval bottlenecks...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load approval bottlenecks";

    return (
      <div className="scr on" id="screen-approvals">
        <div className="cd">
          <div className="ch">Approval bottlenecks</div>
          <div style={{ color: "var(--rd)", fontSize: 13 }}>{message}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="scr on" id="screen-approvals">
        <div className="cd">
          <div className="ch">Approval bottlenecks</div>
          <div style={{ color: "var(--t2)", fontSize: 13 }}>
            No approval bottleneck data available.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scr on" id="screen-approvals">
      <div className="kr">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={getKpiClass(kpi.tone)}>
            <div className="kl">{kpi.label}</div>
            <div className="kv">{kpi.value}</div>
            {kpi.subtext ? <div className="ks">{kpi.subtext}</div> : null}
          </div>
        ))}
      </div>

      <div className="gr c2">
        <div className="cd">
          <div className="ch">Bottleneck by approver type</div>

          {data.bottlenecks.map((item: ApprovalBottleneckItem) => (
            <div key={item.approverType} className="cbr">
              <span className="cbl">{item.approverType}</span>

              <div className="cbt">
                <div
                  className="cbi"
                  style={{
                    width: `${item.widthPercent}%`,
                    ...getApproverBarColor(item.approverType),
                  }}
                >
                  {item.pendingCount} pending
                </div>
              </div>
            </div>
          ))}

          {data.bottlenecks.length === 0 ? (
            <div style={{ color: "var(--t2)", fontSize: 13 }}>
              No approver bottlenecks for this portfolio.
            </div>
          ) : null}
        </div>

        <div className="cd">
          <div className="ch">Most overdue</div>

          {data.mostOverdue.map((item) => (
            <div key={item.id} className="tr2">
              <div
                className="td2"
                style={{
                  background: getOverdueDotColor(item.daysOverdue),
                }}
              />

              <div>
                <div style={{ fontWeight: 500 }}>
                  {item.project} — {item.document}
                </div>

                <div style={{ color: "var(--t2)", fontSize: 12 }}>
                  {item.approverType} — {item.daysOverdue} days overdue
                </div>
              </div>
            </div>
          ))}

          {data.mostOverdue.length === 0 ? (
            <div style={{ color: "var(--t2)", fontSize: 13 }}>
              No overdue approvals for this portfolio.
            </div>
          ) : null}
        </div>
      </div>

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
            {data.pendingApprovals.map(
              (approval: ApprovalBottleneckPendingApproval) => (
                <tr key={approval.id}>
                  <td>{approval.document}</td>
                  <td>{approval.project}</td>
                  <td>{approval.approver}</td>
                  <td>{approval.submitted}</td>
                  <td style={getDaysPendingStyle(approval.status)}>
                    {approval.daysPending}d
                  </td>
                  <td>
                    <span className={getBadgeClass(approval.status)}>
                      {approval.status}
                    </span>
                  </td>
                </tr>
              ),
            )}

            {data.pendingApprovals.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ color: "var(--t2)", fontSize: 13 }}>
                  No pending approvals found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}