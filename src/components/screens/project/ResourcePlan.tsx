import Badge from '@/components/shared/Badge';
import Card from '@/components/shared/Card';
import DataTable from '@/components/shared/DataTable';
import DonutChart from '@/components/shared/DonutChart';
import KpiCard from '@/components/shared/KpiCard';
import Timeline from '@/components/shared/Timeline';
import Toolbar from '@/components/shared/Toolbar';

const rows = [
  { name: 'Site engineers', owner: 'PMO', progress: 82, status: 'Allocated', color: 'green' as const, amount: '12/14' },
  { name: 'Technicians', owner: 'Operations', progress: 65, status: 'Shortage', color: 'amber' as const, amount: '26/40' },
  { name: 'Testing team', owner: 'QA/QC', progress: 50, status: 'Planned', color: 'blue' as const, amount: '4/8' },
  { name: 'Specialist vendor', owner: 'Procurement', progress: 30, status: 'Pending', color: 'red' as const, amount: '1/3' },
];

export default function ResourcePlan() {
  return (
    <div className="screen">
      <Toolbar />
      <div className="project-context"><select className="pm-project-select"><option>ITS2020 Phase 2 Package 2A</option><option>Al Barsha MEP Works</option><option>DIP Warehouse Complex</option></select><span className="hint">Project-specific resource plan view</span></div>
      <div className="kr">
        <KpiCard label="Total resources" value="65" subtext="Planned headcount" color="blue" />
        <KpiCard label="Allocated" value="43" subtext="Confirmed" color="green" />
        <KpiCard label="Shortage" value="14" subtext="Needs allocation" color="amber" />
        <KpiCard label="Critical gaps" value="3" subtext="Escalate" color="red" />
      </div>
      <div className="grid-two"><Card title="Status split"><DonutChart total="65" segments={[{ label: 'On track', value: 46, color: 'green' },{ label: 'In progress', value: 28, color: 'blue' },{ label: 'At risk', value: 18, color: 'amber' },{ label: 'Critical', value: 8, color: 'red' }]} /></Card><Card title="Timeline"><Timeline items={[{ title: 'Civil crew', date: 'Now', progress: 88 },{ title: 'Electrical crew', date: '+1w', progress: 64 },{ title: 'Testing crew', date: '+3w', progress: 35 }]} /></Card></div>
      <Card title="Resource plan register" subtitle="Project data table"><DataTable rows={rows} /></Card>
    </div>
  );
}
