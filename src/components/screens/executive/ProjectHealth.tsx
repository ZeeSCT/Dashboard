import {
  useBlockedItems,
  useDelayedMilestones,
  useHealthTrend,
  useProjectHealthSummary,
} from "@/lib/api";

type HealthTone = "g" | "w" | "d" | "";

function getTone(
  status: string
): HealthTone {
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

function KpiCard({
  item,
}: {
  item: any;
}) {
  return (
    <div
      className={`kc ${getTone(
        item.status
      )}`.trim()}
    >
      <div className="kl">
        {item.label}
      </div>

      <div className="kv">
        {item.value}
      </div>

      <div className="ks">
        {item.percentage}%
      </div>
    </div>
  );
}

function KpiRow({
  kpis,
}: {
  kpis: any[];
}) {
  return (
    <div className="kr">
      {kpis.map((item) => (
        <KpiCard
          key={item.status}
          item={item}
        />
      ))}
    </div>
  );
}

function DelayedMilestonesCard({
  delayedMilestones,
}: {
  delayedMilestones: any[];
}) {
  return (
    <div className="cd">
      <div className="ch">
        Delayed milestones by project
      </div>

      {delayedMilestones.map((item) => (
        <div
          className="cbr"
          key={item.projectId}
        >
          <span className="cbl">
            {item.projectName}
          </span>

          <div className="cbt">
            <div
              className="cbi"
              style={{
                width: `${item.widthPct}%`,
                background:
                  getStatusColor(
                    item.status
                  ),
                color: "#fff",
              }}
            >
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BlockedItemsCard({
  blockedItems,
}: {
  blockedItems: any[];
}) {
  return (
    <div className="cd">
      <div className="ch">
        Blocked items by project
      </div>

      {blockedItems.map((item) => (
        <div
          className="tr2"
          key={item.projectId}
        >
          <div
            className="td2"
            style={{
              background:
                item.blockedItems > 0
                  ? "var(--rd)"
                  : "var(--gn)",
            }}
          />

          <div>
            <div className="font-medium">
              {item.projectName}
            </div>

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
      ))}
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

function HealthTrendCard({
  healthTrend,
}: {
  healthTrend: any[];
}) {
  return (
    <div className="cd">
      <div className="ch">
        Health trend — last 4 weeks
      </div>

      <div className="wg">
        {healthTrend.map((week) => (
          <div
            className="wc"
            key={week.week}
          >
            <div className="wl">
              {week.week}
            </div>

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

export default function ProjectHealth() {
  const {
    data: kpis = [],
    isLoading: summaryLoading,
  } =
    useProjectHealthSummary();

  const {
    data: delayedMilestones = [],
  } = useDelayedMilestones();

  const {
    data: blockedItems = [],
  } = useBlockedItems();

  const {
    data: healthTrend = [],
  } = useHealthTrend();

  if (summaryLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="scr on"
      id="screen-health"
    >
      <KpiRow kpis={kpis} />

      <div className="gr c2">
        <DelayedMilestonesCard
          delayedMilestones={
            delayedMilestones
          }
        />

        <BlockedItemsCard
          blockedItems={blockedItems}
        />
      </div>

      <HealthTrendCard
        healthTrend={healthTrend}
      />
    </div>
  );
}