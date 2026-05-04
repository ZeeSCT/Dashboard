

type HealthTone = "g" | "w" | "d" | "";

interface KpiItem {
  label: string;
  value: string | number;
  subtext: string;
  tone?: HealthTone;
}

interface DelayedMilestoneItem {
  project: string;
  label: string;
  width: string;
  background: string;
  color: string;
}

interface BlockedItem {
  project: string;
  description: string;
  color: string;
}

interface HealthTrendWeek {
  week: string;
  onTrack: number;
  atRisk: number;
  delayed: number;
  critical: number;
}

const kpis: KpiItem[] = [
  {
    label: "On track",
    value: 12,
    subtext: "50%",
    tone: "g",
  },
  {
    label: "At risk",
    value: 6,
    subtext: "25%",
    tone: "w",
  },
  {
    label: "Delayed",
    value: 4,
    subtext: "17%",
    tone: "d",
  },
  {
    label: "Critical",
    value: 2,
    subtext: "Immediate action",
    tone: "d",
  },
];

const delayedMilestones: DelayedMilestoneItem[] = [
  {
    project: "Al Barsha MEP",
    label: "3 milestones",
    width: "70%",
    background: "var(--rbg)",
    color: "var(--rt)",
  },
  {
    project: "DAFZA Ind. Ph.2",
    label: "2 milestones",
    width: "50%",
    background: "var(--rbg)",
    color: "var(--rt)",
  },
  {
    project: "JLT Tower",
    label: "1",
    width: "25%",
    background: "var(--abg)",
    color: "var(--at)",
  },
  {
    project: "Mirdif Villa",
    label: "1",
    width: "25%",
    background: "var(--abg)",
    color: "var(--at)",
  },
  {
    project: "DIP Warehouse",
    label: "1",
    width: "25%",
    background: "var(--abg)",
    color: "var(--at)",
  },
];

const blockedItems: BlockedItem[] = [
  {
    project: "Al Barsha MEP",
    description: "3 packages — authority approval missing",
    color: "var(--rd)",
  },
  {
    project: "Mirdif Villa",
    description: "1 package — material not delivered",
    color: "var(--am)",
  },
  {
    project: "DAFZA Industrial",
    description: "1 package — NCR not resolved",
    color: "var(--am)",
  },
  {
    project: "Business Bay Infra",
    description: "No blocked items",
    color: "var(--gn)",
  },
];

const healthTrend: HealthTrendWeek[] = [
  {
    week: "Week 1",
    onTrack: 10,
    atRisk: 7,
    delayed: 5,
    critical: 2,
  },
  {
    week: "Week 2",
    onTrack: 11,
    atRisk: 7,
    delayed: 4,
    critical: 2,
  },
  {
    week: "Week 3",
    onTrack: 11,
    atRisk: 6,
    delayed: 5,
    critical: 2,
  },
  {
    week: "Week 4 (now)",
    onTrack: 12,
    atRisk: 6,
    delayed: 4,
    critical: 2,
  },
];

function KpiCard({ item }: { item: KpiItem }) {
  return (
    <div className={`kc ${item.tone ?? ""}`.trim()}>
      <div className="kl">{item.label}</div>
      <div className="kv">{item.value}</div>
      <div className="ks">{item.subtext}</div>
    </div>
  );
}

function KpiRow() {
  return (
    <div className="kr">
      {kpis.map((item) => (
        <KpiCard key={item.label} item={item} />
      ))}
    </div>
  );
}

function DelayedMilestonesCard() {
  return (
    <div className="cd">
      <div className="ch">Delayed milestones by project</div>

      {delayedMilestones.map((item) => (
        <div className="cbr" key={item.project}>
          <span className="cbl">{item.project}</span>

          <div className="cbt">
            <div
              className="cbi"
              style={{
                width: item.width,
                background: item.background,
                color: item.color,
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

function BlockedItemsCard() {
  return (
    <div className="cd">
      <div className="ch">Blocked items by project</div>

      {blockedItems.map((item) => (
        <div className="tr2" key={item.project}>
          <div
            className="td2"
            style={{
              background: item.color,
            }}
          />

          <div>
            <div className="font-medium">{item.project}</div>
            <div
              style={{
                color: "var(--t2)",
                fontSize: 12,
              }}
            >
              {item.description}
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

function HealthTrendCard() {
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
              color="var(--rd)"
              label="Delayed"
              value={week.delayed}
            />

            <TrendStatusRow
              color="#888780"
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
  return (
    <div className="scr on" id="screen-health">
      <KpiRow />

      <div className="gr c2">
        <DelayedMilestonesCard />
        <BlockedItemsCard />
      </div>

      <HealthTrendCard />
    </div>
  );
}