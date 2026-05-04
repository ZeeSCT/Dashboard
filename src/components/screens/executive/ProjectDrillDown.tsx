"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PortfolioCategoryCode,
  ProjectActivitySeverity,
  ProjectDrillDownMilestone,
  ProjectDrillDownPackage,
  ProjectHealthStatus,
  useProjectDrillDown,
} from "@/lib/api";

interface ProjectDrillDownProps {
  selectedPortfolioCategory?: PortfolioCategoryCode;
}

interface ProjectDrillDownKpiCard {
  label: string;
  value: string | number;
  subtext?: string;
  tone: "g" | "w" | "d";
}

function getBadgeClass(
  status: ProjectHealthStatus | ProjectDrillDownMilestone["status"],
) {
  switch (status) {
    case "ON_TRACK":
    case "Complete":
      return "b bg2";

    case "AT_RISK":
    case "DELAYED":
    case "At risk":
    case "Delayed":
      return "b ba";

    case "CRITICAL":
      return "b br";

    case "Upcoming":
      return "b bgr";

    default:
      return "b bgr";
  }
}

function getProgressClass(status: ProjectHealthStatus) {
  switch (status) {
    case "ON_TRACK":
      return "bf bfg";

    case "AT_RISK":
    case "DELAYED":
      return "bf bfa";

    case "CRITICAL":
      return "bf bfr";

    default:
      return "bf";
  }
}

function getActivityColor(severity: ProjectActivitySeverity) {
  switch (severity) {
    case "success":
      return "var(--gn)";

    case "warning":
      return "var(--am)";

    case "danger":
      return "var(--rd)";

    default:
      return "var(--t2)";
  }
}

function getVarianceText(varianceDays: number | null) {
  if (varianceDays === null) return "—";
  if (varianceDays > 0) return `+${varianceDays}d`;
  if (varianceDays < 0) return `${varianceDays}d`;
  return "0d";
}

function getVarianceColor(
  varianceDays: number | null,
  status: ProjectDrillDownMilestone["status"],
) {
  if (status === "Complete") return "var(--gn)";
  if (varianceDays === null) return "var(--t2)";
  if (status === "Delayed") return "var(--rd)";
  if (status === "At risk") return "var(--am)";
  return "var(--t2)";
}

function formatDate(value?: string | null) {
  if (!value) return "TBD";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPeriod(startDate?: string | null, endDate?: string | null) {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (start === "TBD" && end === "TBD") return "Dates not set";
  return `${start} – ${end}`;
}

export default function ProjectDrillDown({
  selectedPortfolioCategory = "all",
}: ProjectDrillDownProps) {
  const category = selectedPortfolioCategory;

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const { data, isLoading, isError, error } = useProjectDrillDown(
    category,
    selectedProjectId,
  );

  useEffect(() => {
    setSelectedProjectId(null);
  }, [category]);

  useEffect(() => {
    if (!selectedProjectId && data?.selectedProjectId) {
      setSelectedProjectId(data.selectedProjectId);
    }
  }, [data?.selectedProjectId, selectedProjectId]);
  const project = data?.project ?? null;
  const projects = data?.projects ?? [];

  const kpis = useMemo<ProjectDrillDownKpiCard[]>(() => {
    if (!project) return [];

    return [
      {
        label: "Completion",
        value: `${project.kpis.completion}%`,
        subtext: `Plan: ${project.kpis.plannedProgress}%`,
        tone:
          project.kpis.completion >= project.kpis.plannedProgress
            ? "g"
            : project.kpis.completion >= project.kpis.plannedProgress - 10
              ? "w"
              : "d",
      },
      {
        label: "Schedule variance",
        value:
          project.kpis.scheduleVariance > 0
            ? `+${project.kpis.scheduleVariance}%`
            : `${project.kpis.scheduleVariance}%`,
        tone:
          project.kpis.scheduleVariance >= 0
            ? "g"
            : project.kpis.scheduleVariance >= -10
              ? "w"
              : "d",
      },
      {
        label: "Blocked packages",
        value: project.kpis.blockedPackages,
        subtext: `Of ${project.kpis.totalPackages} total`,
        tone: project.kpis.blockedPackages > 0 ? "d" : "g",
      },
      {
        label: "Pending approvals",
        value: project.kpis.pendingApprovals,
        subtext: `${project.kpis.overdueApprovals} overdue`,
        tone: project.kpis.overdueApprovals > 0 ? "d" : "g",
      },
      {
        label: "Open NCRs",
        value: project.kpis.openNcrs,
        tone: project.kpis.openNcrs > 0 ? "w" : "g",
      },
    ];
  }, [project]);

  if (isLoading) {
    return (
      <div className="scr on" id="screen-drilldown">
        <div className="cd">
          <div className="ch">Project drill down</div>
          <div style={{ color: "var(--t2)", fontSize: 13 }}>
            Loading project summary...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const message =
      error instanceof Error ? error.message : "Unable to load project summary";

    return (
      <div className="scr on" id="screen-drilldown">
        <div className="cd">
          <div className="ch">Project drill down</div>
          <div style={{ color: "var(--rd)", fontSize: 13 }}>{message}</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="scr on" id="screen-drilldown">
        <div className="cd">
          <div className="ch">Project drill down</div>
          <div style={{ color: "var(--t2)", fontSize: 13 }}>
            No project summary available.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scr on" id="screen-drilldown">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <select
          className="ps"
          value={selectedProjectId ?? project.id}
          onChange={(event) => setSelectedProjectId(event.target.value)}
        >
          {projects.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <span className={getBadgeClass(project.healthStatus)}>
          {project.health}
        </span>

        <span style={{ fontSize: 12, color: "var(--t3)" }}>
          PM: {project.projectManager ?? "Unassigned"} &nbsp;|&nbsp;{" "}
          {project.clientName ?? "No client"} &nbsp;|&nbsp;{" "}
          {formatPeriod(project.startDate, project.endDate)}
        </span>
      </div>

      <div className="kr">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`kc ${kpi.tone}`}>
            <div className="kl">{kpi.label}</div>
            <div className="kv">{kpi.value}</div>
            {kpi.subtext ? <div className="ks">{kpi.subtext}</div> : null}
          </div>
        ))}
      </div>

      <div className="gr c2">
        <div className="cd">
          <div className="ch">Package breakdown</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {project.packages.map((item: ProjectDrillDownPackage) => (
              <div key={item.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 3,
                    gap: 10,
                  }}
                >
                  <span>{item.name}</span>

                  <span className={getBadgeClass(item.status)}>
                    {item.status === "ON_TRACK"
                      ? "On track"
                      : item.status === "AT_RISK"
                        ? "At risk"
                        : item.status === "DELAYED"
                          ? "Delayed"
                          : "Critical"}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div className="bw" style={{ flex: 1 }}>
                    <div
                      className={getProgressClass(item.status)}
                      style={{ width: `${item.completion}%` }}
                    />
                  </div>

                  <span style={{ fontSize: 11, color: "var(--t2)" }}>
                    {item.completion}%
                  </span>
                </div>
              </div>
            ))}

            {project.packages.length === 0 ? (
              <div style={{ color: "var(--t2)", fontSize: 13 }}>
                No package data available.
              </div>
            ) : null}
          </div>
        </div>

        <div className="cd">
          <div className="ch">Recent activity</div>

          {project.activities.map((activity) => (
            <div key={activity.id} className="tr2">
              <div
                className="td2"
                style={{ background: getActivityColor(activity.severity) }}
              />

              <div>
                <div style={{ fontWeight: 500 }}>{activity.title}</div>
                <div style={{ color: "var(--t2)", fontSize: 12 }}>
                  {activity.description}
                </div>
              </div>
            </div>
          ))}

          {project.activities.length === 0 ? (
            <div style={{ color: "var(--t2)", fontSize: 13 }}>
              No recent activity available.
            </div>
          ) : null}
        </div>
      </div>

      <div className="cd">
        <div className="ch">Milestone tracker</div>

        <table>
          <thead>
            <tr>
              <th>Milestone</th>
              <th>Planned</th>
              <th>Forecast</th>
              <th>Variance</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {project.milestones.map((milestone) => (
              <tr key={milestone.id}>
                <td>{milestone.name}</td>
                <td>{formatDate(milestone.plannedDate)}</td>
                <td>{formatDate(milestone.forecastDate)}</td>
                <td
                  style={{
                    color: getVarianceColor(
                      milestone.varianceDays,
                      milestone.status,
                    ),
                    fontWeight: 500,
                  }}
                >
                  {getVarianceText(milestone.varianceDays)}
                </td>
                <td>
                  <span className={getBadgeClass(milestone.status)}>
                    {milestone.status}
                  </span>
                </td>
              </tr>
            ))}

            {project.milestones.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ color: "var(--t2)", fontSize: 13 }}>
                  No milestone data available.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
