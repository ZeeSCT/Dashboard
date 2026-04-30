import Badge from '@/components/shared/Badge';
import Card from '@/components/shared/Card';
import DataTable from '@/components/shared/DataTable';
import DonutChart from '@/components/shared/DonutChart';
import KpiCard from '@/components/shared/KpiCard';
import Timeline from '@/components/shared/Timeline';
import Toolbar from '@/components/shared/Toolbar';

const rows = [
  { name: 'Design approval', owner: 'Client', progress: 100, status: 'Closed', color: 'green' as const, amount: 'M01' },
  { name: 'Material delivery', owner: 'Procurement', progress: 78, status: 'On track', color: 'blue' as const, amount: 'M02' },
  { name: 'Site readiness', owner: 'Construction', progress: 64, status: 'Watch', color: 'amber' as const, amount: 'M03' },
  { name: 'Final inspection', owner: 'QA/QC', progress: 20, status: 'Pending', color: 'red' as const, amount: 'M04' },
];

export default function MilestoneRegister() {
  return (
    <div className="screen">
      <Toolbar />
      <div className="project-context"><select className="pm-project-select"><option>ITS2020 Phase 2 Package 2A</option><option>Al Barsha MEP Works</option><option>DIP Warehouse Complex</option></select><span className="hint">Project-specific milestone register view</span></div>
      <div className="kr">
        <KpiCard label="Total milestones" value="32" subtext="Lifecycle gates" color="blue" />
        <KpiCard label="Closed" value="14" subtext="44% achieved" color="green" />
        <KpiCard label="Due soon" value="6" subtext="Next 14 days" color="amber" />
        <KpiCard label="Overdue" value="2" subtext="Escalation needed" color="red" />
      </div>
      <div className="grid-two"><Card title="Status split"><DonutChart total="32" segments={[{ label: 'On track', value: 46, color: 'green' },{ label: 'In progress', value: 28, color: 'blue' },{ label: 'At risk', value: 18, color: 'amber' },{ label: 'Critical', value: 8, color: 'red' }]} /></Card><Card title="Timeline"><Timeline items={[{ title: 'Baseline approval', date: 'Done', progress: 100 },{ title: 'Factory acceptance', date: 'May', progress: 67 },{ title: 'Site acceptance', date: 'Jun', progress: 36 }]} /></Card></div>
      <Card title="Milestone register register" subtitle="Project data table"><DataTable rows={rows} /></Card>
    </div>
  );
}
