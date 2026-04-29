import Badge from '@/components/shared/Badge';
import Card from '@/components/shared/Card';
import DataTable from '@/components/shared/DataTable';
import DonutChart from '@/components/shared/DonutChart';
import KpiCard from '@/components/shared/KpiCard';
import Timeline from '@/components/shared/Timeline';
import Toolbar from '@/components/shared/Toolbar';

const rows = [
  { name: 'Cable pulling', owner: 'Site Team', progress: 68, status: 'In progress', color: 'blue' as const, amount: 'A-104' },
  { name: 'Panel termination', owner: 'Electrical', progress: 41, status: 'At risk', color: 'amber' as const, amount: 'A-118' },
  { name: 'Loop testing', owner: 'Testing', progress: 22, status: 'Pending', color: 'red' as const, amount: 'A-132' },
  { name: 'As-built update', owner: 'Document Control', progress: 88, status: 'On track', color: 'green' as const, amount: 'A-145' },
];

export default function ActivityRegister() {
  return (
    <div className="screen">
      <Toolbar />
      <div className="project-context"><select className="pm-project-select"><option>ITS2020 Phase 2 Package 2A</option><option>Al Barsha MEP Works</option><option>DIP Warehouse Complex</option></select><span className="hint">Project-specific activity register view</span></div>
      <div className="kr">
        <KpiCard label="Activities" value="146" subtext="Baseline activities" color="blue" />
        <KpiCard label="Completed" value="79" subtext="54% completed" color="green" />
        <KpiCard label="In progress" value="38" subtext="Active site tasks" color="purple" />
        <KpiCard label="Delayed" value="9" subtext="Recovery required" color="red" />
      </div>
      <div className="grid-two"><Card title="Status split"><DonutChart total="146" segments={[{ label: 'On track', value: 46, color: 'green' },{ label: 'In progress', value: 28, color: 'blue' },{ label: 'At risk', value: 18, color: 'amber' },{ label: 'Critical', value: 8, color: 'red' }]} /></Card><Card title="Timeline"><Timeline items={[{ title: 'Engineering release', date: 'Done', progress: 100 },{ title: 'Site execution', date: 'Now', progress: 61 },{ title: 'Testing', date: 'Next', progress: 24 }]} /></Card></div>
      <Card title="Activity register register" subtitle="Project data table"><DataTable rows={rows} /></Card>
    </div>
  );
}
