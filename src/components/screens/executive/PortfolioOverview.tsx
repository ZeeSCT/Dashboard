"use client";

import {
  ApiError,
  PortfolioCategoryCode,
  PortfolioOverviewProject,
  PortfolioTopIssue,
  ProjectHealthLabel,
  usePortfolioOverview,
} from "@/lib/api";

type PortfolioOverviewProps = {
  selectedPortfolioCategory?: PortfolioCategoryCode;
};

export default function PortfolioOverview({
  selectedPortfolioCategory = "all",
}: PortfolioOverviewProps) {
  const {
    data,
    isLoading,
    isError,
    error,
  } = usePortfolioOverview(selectedPortfolioCategory);

  const stats = data?.kpis ?? {
    activeProjects: 0,
    portfolioCompletion: 0,
    delayedMilestones: 0,
    pendingApprovals: 0,
    blockedItems: 0,
    billingReadyAmount: 0,
    billingReadyProjects: 0,
  };

  const healthCounts: Record<ProjectHealthLabel, number> = {
    "On track": data?.healthStatus.counts.onTrack ?? 0,
    "At risk": data?.healthStatus.counts.atRisk ?? 0,
    Delayed: data?.healthStatus.counts.delayed ?? 0,
    Critical: data?.healthStatus.counts.critical ?? 0,
  };

  const projects = data?.projects ?? [];
  const topIssues = data?.topIssues ?? [];

  if (isLoading) {
    return (
      <div className="scr on" id="screen-portfolio">
        <div className="cd">
          <div className="ch">Portfolio overview</div>
          <div className="ks">Loading portfolio data...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    const message =
      error instanceof ApiError || error instanceof Error
        ? error.message
        : "Failed to load portfolio overview.";

    return (
      <div className="scr on" id="screen-portfolio">
        <div className="cd">
          <div className="ch">Portfolio overview</div>
          <div className="ks" style={{ color: "var(--rd)" }}>
            {message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scr on" id="screen-portfolio">
      <section className="kr">
        <KpiCard
          variant="g"
          label="Active projects"
          value={stats.activeProjects}
          subtext="Selected portfolio"
        />

        <KpiCard
          label="Portfolio completion"
          value={`${stats.portfolioCompletion}%`}
          subtext="Avg. across selected"
        />

        <KpiCard
          variant="w"
          label="Delayed milestones"
          value={stats.delayedMilestones}
          subtext={`Across selected projects`}
        />

        <KpiCard
          variant="d"
          label="Pending approvals"
          value={stats.pendingApprovals}
          subtext={`${stats.blockedItems} blocked items`}
        />

        <KpiCard
          variant="g"
          label="Billing ready"
          value={formatAED(stats.billingReadyAmount)}
          subtext={`${stats.billingReadyProjects} projects`}
        />
      </section>

      <section className="gr c2">
        <HealthStatusCard
          total={data?.healthStatus.total ?? stats.activeProjects}
          healthCounts={healthCounts}
        />

        <TopPortfolioIssues issues={topIssues} />
      </section>

      <ProjectSummaryTable
        projects={projects}
        activeProjects={stats.activeProjects}
      />
    </div>
  );
}

function KpiCard({
  label,
  value,
  subtext,
  variant,
}: {
  label: string;
  value: string | number;
  subtext: string;
  variant?: "g" | "w" | "d";
}) {
  return (
    <div className={`kc ${variant ?? ""}`.trim()}>
      <div className="kl">{label}</div>
      <div className="kv">{value}</div>
      <div className="ks">{subtext}</div>
    </div>
  );
}

function HealthStatusCard({
  total,
  healthCounts,
}: {
  total: number;
  healthCounts: Record<ProjectHealthLabel, number>;
}) {
  return (
    <div className="cd">
      <div className="ch">Projects by health status</div>

      <div className="dw">
        <HealthDonut total={total} healthCounts={healthCounts} />

        <div className="dl">
          <LegendItem
            color="var(--gn)"
            label="On track"
            value={healthCounts["On track"]}
          />
          <LegendItem
            color="var(--am)"
            label="At risk"
            value={healthCounts["At risk"]}
          />
          <LegendItem
            color="var(--rd)"
            label="Delayed"
            value={healthCounts.Delayed}
          />
          <LegendItem
            color="#888780"
            label="Critical"
            value={healthCounts.Critical}
          />
        </div>
      </div>
    </div>
  );
}

function HealthDonut({
  total,
  healthCounts,
}: {
  total: number;
  healthCounts: Record<ProjectHealthLabel, number>;
}) {
  const size = 120;
  const center = size / 2;
  const radius = 45;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    {
      label: "On track",
      value: healthCounts["On track"],
      color: "var(--gn)",
    },
    {
      label: "At risk",
      value: healthCounts["At risk"],
      color: "var(--am)",
    },
    {
      label: "Delayed",
      value: healthCounts.Delayed,
      color: "var(--rd)",
    },
    {
      label: "Critical",
      value: healthCounts.Critical,
      color: "#888780",
    },
  ];

  let usedLength = 0;

  return (
    <svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={center}
        cy={center}
        fill="none"
        r={radius}
        stroke="#EAF3DE"
        strokeWidth={strokeWidth}
      />

      {segments.map((segment) => {
        const segmentLength =
          total === 0 ? 0 : (segment.value / total) * circumference;

        const segmentOffset = usedLength;
        usedLength += segmentLength;

        return (
          <circle
            key={segment.label}
            cx={center}
            cy={center}
            fill="none"
            r={radius}
            stroke={segment.color}
            strokeDasharray={`${segmentLength} ${
              circumference - segmentLength
            }`}
            strokeDashoffset={-segmentOffset}
            strokeWidth={strokeWidth}
            transform={`rotate(-90 ${center} ${center})`}
          />
        );
      })}

      <text
        fill="var(--t1)"
        fontSize="18"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="middle"
        x={center}
        y={center}
      >
        {total}
      </text>
    </svg>
  );
}

function LegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div className="li">
      <div className="ld" style={{ background: color }} />
      {label} — {value}
    </div>
  );
}

function TopPortfolioIssues({
  issues,
}: {
  issues: PortfolioTopIssue[];
}) {
  return (
    <div className="cd">
      <div className="ch">Top portfolio issues</div>

      {issues.length > 0 ? (
        issues.map((issue) => (
          <div className="tr2" key={issue.id}>
            <span
              className="td2"
              style={{ background: getIssueDotColor(issue.health) }}
            />
            <span>
              {issue.projectName} — {issue.issueTitle}
            </span>
          </div>
        ))
      ) : (
        <div className="tr2">
          <span className="td2" style={{ background: "var(--gn)" }} />
          <span>No major issues for this portfolio.</span>
        </div>
      )}
    </div>
  );
}

function ProjectSummaryTable({
  projects,
  activeProjects,
}: {
  projects: PortfolioOverviewProject[];
  activeProjects: number;
}) {
  return (
    <div className="cd">
      <div className="ch">
        Project summary table <span>{activeProjects} active projects</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>PM</th>
            <th>Completion</th>
            <th>Health</th>
            <th>Delayed approvals</th>
            <th>Blocked</th>
            <th>Billing ready</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.project}</td>

              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <div className="av">{getInitials(project.pm)}</div>
                  {project.pm}
                </div>
              </td>

              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <div className="bw" style={{ width: 54 }}>
                    <div
                      className={`bf ${getProgressClass(project.health)}`}
                      style={{ width: `${project.completion}%` }}
                    />
                  </div>
                  {project.completion}%
                </div>
              </td>

              <td>
                <span className={`b ${getHealthBadgeClass(project.health)}`}>
                  {project.health}
                </span>
              </td>

              <td>{project.delayedApprovals}</td>
              <td>{project.blocked}</td>

              <td>
                {project.billingReady !== null ? (
                  <span className="b bg2">
                    {formatAED(project.billingReady)}
                  </span>
                ) : (
                  <span className="b bgr">Not ready</span>
                )}
              </td>
            </tr>
          ))}

          {projects.length === 0 && (
            <tr>
              <td colSpan={7}>No projects found for this portfolio.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function getInitials(name: string) {
  if (!name || name === "Unassigned") return "NA";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .replace(".", "")
    .slice(0, 2)
    .toUpperCase();
}

function formatAED(value: number) {
  if (value >= 1_000_000) {
    return `AED ${(value / 1_000_000).toFixed(1)}M`;
  }

  return `AED ${value.toLocaleString()}`;
}

function getIssueDotColor(health: ProjectHealthLabel) {
  switch (health) {
    case "Critical":
    case "Delayed":
      return "var(--rd)";
    case "At risk":
      return "var(--am)";
    case "On track":
      return "var(--gn)";
    default:
      return "var(--am)";
  }
}

function getHealthBadgeClass(health: ProjectHealthLabel) {
  switch (health) {
    case "On track":
      return "bg2";
    case "At risk":
      return "ba";
    case "Delayed":
      return "br";
    case "Critical":
      return "br";
    default:
      return "bg2";
  }
}

function getProgressClass(health: ProjectHealthLabel) {
  switch (health) {
    case "On track":
      return "bfg";
    case "At risk":
      return "bfa";
    case "Delayed":
      return "bfa";
    case "Critical":
      return "bfr";
    default:
      return "bfg";
  }
}