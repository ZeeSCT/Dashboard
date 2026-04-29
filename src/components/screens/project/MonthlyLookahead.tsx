import Badge from '@/components/shared/Badge';
import Card from '@/components/shared/Card';
import DataTable from '@/components/shared/DataTable';
import DonutChart from '@/components/shared/DonutChart';
import KpiCard from '@/components/shared/KpiCard';
import Timeline from '@/components/shared/Timeline';
import Toolbar from '@/components/shared/Toolbar';

const rows = [
  { name: 'Week 1 installation zone A', owner: 'Site Team', progress: 74, status: 'Ready', color: 'green' as const, amount: 'W1' },
  { name: 'Week 2 controller setup', owner: 'Engineering', progress: 58, status: 'Planned', color: 'blue' as const, amount: 'W2' },
  { name: 'Week 3 integration testing', owner: 'Testing', progress: 42, status: 'Inputs needed', color: 'amber' as const, amount: 'W3' },
  { name: 'Week 4 authority inspection', owner: 'QA/QC', progress: 25, status: 'Risk', color: 'red' as const, amount: 'W4' },
];

export default function MonthlyLookahead() {
  return (
    <div className="screen">
      <Toolbar />
      <div className="project-context"><select className="pm-project-select"><option>ITS2020 Phase 2 Package 2A</option><option>Al Barsha MEP Works</option><option>DIP Warehouse Complex</option></select><span className="hint">Project-specific monthly lookahead view</span></div>
      <div className="kr">
        <KpiCard label="Lookahead items" value="28" subtext="Next 4 weeks" color="blue" />
        <KpiCard label="Ready to start" value="13" subtext="No blockers" color="green" />
        <KpiCard label="Input pending" value="9" subtext="Approvals/material" color="amber" />
        <KpiCard label="At risk" value="4" subtext="Needs action" color="red" />
      </div>
      <div className="grid-two"><Card title="Status split"><DonutChart total="28" segments={[{ label: 'On track', value: 46, color: 'green' },{ label: 'In progress', value: 28, color: 'blue' },{ label: 'At risk', value: 18, color: 'amber' },{ label: 'Critical', value: 8, color: 'red' }]} /></Card><Card title="Timeline"><Timeline items={[{ title: 'Week 1', date: 'Ready', progress: 74 },{ title: 'Week 2', date: 'Planned', progress: 58 },{ title: 'Week 3', date: 'Pending inputs', progress: 42 },{ title: 'Week 4', date: 'At risk', progress: 25 }]} /></Card></div>
      <Card title="Monthly lookahead register" subtitle="Project data table"><DataTable rows={rows} /></Card>
    </div>
  );
}
