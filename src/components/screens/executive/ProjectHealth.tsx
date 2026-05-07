"use client";

import {
  type BlockedItem,
  type DelayedMilestoneItem,
  type HealthTrendItem,
  type PortfolioCategoryCode,
  type ProjectHealthSummaryItem,
  useBlockedItems,
  useDelayedMilestones,
  useHealthTrend,
  useProjectHealthSummary,
} from "@/lib/api";

type HealthTone = "g" | "w" | "d" | "";

type ProjectHealthProps = {
  selectedPortfolioCategory?: PortfolioCategoryCode;
};

function getTone(status: string): HealthTone {
  switch (status) {
    case "ON_TRACK":
      return "g";

    case "AT_RISK":
      return "w";

    case "DELAYED":
      return "";

    case "CRITICAL":
      return "d";

    default:
      return "";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "ON_TRACK":
      return "var(--gn)";

    case "AT_RISK":
      return "var(--am)";

    case "DELAYED":
      return "#888780";

    case "CRITICAL":
      return "var(--rd)";

    default:
      return "var(--gn)";
  }
}

function KpiCard({ item }: { item: ProjectHealthSummaryItem }) {
  return (
    <div className={`kc ${getTone(item.status)}`.trim()}>
      <div className="kl">{item.label}</div>
      <div className="kv">{item.value ?? 0}</div>
      <div className="ks">{item.percentage ?? 0}%</div>
    </div>
  );
}

function KpiRow({ kpis }: { kpis: ProjectHealthSummaryItem[] }) {
  if (!Array.isArray(kpis)) return null;

  return (
    <div className="kr">
      {kpis.map((item) => (
        <KpiCard key={item.status} item={item} />
      ))}
    </div>
  );
}

function DelayedMilestonesCard({
  delayedMilestones,
}: {
  delayedMilestones: DelayedMilestoneItem[];
}) {
  return (
    <div className="cd">
      <div className="ch">Delayed milestones by project</div>

      {delayedMilestones.length ? (
        delayedMilestones.map((item) => (
          <div className="cbr" key={item.projectId}>
            <span className="cbl">{item.projectName}</span>

            <div className="cbt">
              <div
                className="cbi"
                style={{
                  width: `${item.widthPct}%`,
                  background: getStatusColor(item.status),
                  color: "#fff",
                }}
              >
                {item.label}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ color: "var(--t2)", fontSize: 13 }}>
          No delayed milestones for this portfolio.
        </div>
      )}
    </div>
  );
}

function BlockedItemsCard({ blockedItems }: { blockedItems: BlockedItem[] }) {
  return (
    <div className="cd">
      <div className="ch">Blocked items by project</div>

      {blockedItems.length ? (
        blockedItems.map((item) => (
          <div className="tr2" key={item.projectId}>
            <div
              className="td2"
              style={{
                background: item.blockedItems > 0 ? "var(--rd)" : "var(--gn)",
              }}
            />

            <div>
              <div style={{ fontWeight: 500 }}>{item.projectName}</div>

              <div
                style={{
                  color: "var(--t2)",
                  fontSize: 12,
                }}
              >
                {item.label}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ color: "var(--t2)", fontSize: 13 }}>
          No blocked items for this portfolio.
        </div>
      )}
    </div>
  );
}

function TrendStatusRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div className="ws">
      <span
        className="wd"
        style={{
          background: color,
        }}
      />

      {label}: {value}
    </div>
  );
}

function HealthTrendCard({ healthTrend }: { healthTrend: HealthTrendItem[] }) {
  return (
    <div className="cd">
      <div className="ch">Health trend — last 4 weeks</div>

      <div className="wg">
        {healthTrend.map((week) => (
          <div className="wc" key={week.week}>
            <div className="wl">{week.week}</div>

            <TrendStatusRow
              color="var(--gn)"
              label="On track"
              value={week.onTrack}
            />

            <TrendStatusRow
              color="var(--am)"
              label="At risk"
              value={week.atRisk}
            />

            <TrendStatusRow
              color="#888780"
              label="Delayed"
              value={week.delayed}
            />

            <TrendStatusRow
              color="var(--rd)"
              label="Critical"
              value={week.critical}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectHealth({
  selectedPortfolioCategory = "all",
}: ProjectHealthProps) {
  const category = selectedPortfolioCategory;

  const {
    data: kpis = [],
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErrorData,
  } = useProjectHealthSummary(category);

  const {
    data: delayedMilestones = [],
    isLoading: milestonesLoading,
    isError: milestonesError,
    error: milestonesErrorData,
  } = useDelayedMilestones(category);

  const {
    data: blockedItems = [],
    isLoading: blockedLoading,
    isError: blockedError,
    error: blockedErrorData,
  } = useBlockedItems(category);

  const { data: healthTrend = [] } = useHealthTrend();

  const isLoading = summaryLoading || milestonesLoading || blockedLoading;
  const isError = summaryError || milestonesError || blockedError;

  const error =
    summaryErrorData instanceof Error
      ? summaryErrorData
      : milestonesErrorData instanceof Error
        ? milestonesErrorData
        : blockedErrorData instanceof Error
          ? blockedErrorData
          : null;

  if (isLoading) {
    return (
      <div className="scr on" id="screen-health">
        <div className="cd">
          <div className="ch">Project health</div>
          <div style={{ color: "var(--t2)", fontSize: 13 }}>
            Loading project health...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="scr on" id="screen-health">
        <div className="cd">
          <div className="ch">Project health</div>
          <div style={{ color: "var(--rd)", fontSize: 13 }}>
            {error?.message ?? "Unable to load project health"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scr on" id="screen-health">
      <KpiRow kpis={kpis} />

      <div className="gr c2">
        <DelayedMilestonesCard delayedMilestones={delayedMilestones} />
        <BlockedItemsCard blockedItems={blockedItems} />
      </div>

      <HealthTrendCard healthTrend={healthTrend} />
    </div>
  );
}