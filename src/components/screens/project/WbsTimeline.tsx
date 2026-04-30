import Badge from '@/components/shared/Badge';
import Card from '@/components/shared/Card';
import DataTable from '@/components/shared/DataTable';
import DonutChart from '@/components/shared/DonutChart';
import KpiCard from '@/components/shared/KpiCard';
import Timeline from '@/components/shared/Timeline';
import Toolbar from '@/components/shared/Toolbar';

const rows = [
  { name: 'Civil enabling works', owner: 'Planning', progress: 92, status: 'Almost done', color: 'green' as const, amount: 'WBS-01' },
  { name: 'Equipment foundation', owner: 'Site Team', progress: 71, status: 'On track', color: 'blue' as const, amount: 'WBS-02' },
  { name: 'Controller installation', owner: 'Engineering', progress: 48, status: 'At risk', color: 'amber' as const, amount: 'WBS-03' },
  { name: 'Testing & commissioning', owner: 'QA/QC', progress: 24, status: 'Pending', color: 'red' as const, amount: 'WBS-04' },
];

export default function WbsTimeline() {
  return (
    <div className="screen">
      <Toolbar />
      <div className="project-context"><select className="pm-project-select"><option>ITS2020 Phase 2 Package 2A</option><option>Al Barsha MEP Works</option><option>DIP Warehouse Complex</option></select><span className="hint">Project-specific wbs timeline view</span></div>
      <div className="kr">
        <KpiCard label="WBS packages" value="18" subtext="4 major workstreams" color="blue" />
        <KpiCard label="Completed" value="7" subtext="39% closed" color="green" />
        <KpiCard label="At risk" value="3" subtext="Needs recovery" color="amber" />
        <KpiCard label="Blocked" value="1" subtext="Client dependency" color="red" />
      </div>
      <div className="grid-two"><Card title="Status split"><DonutChart total="18" segments={[{ label: 'On track', value: 46, color: 'green' },{ label: 'In progress', value: 28, color: 'blue' },{ label: 'At risk', value: 18, color: 'amber' },{ label: 'Critical', value: 8, color: 'red' }]} /></Card><Card title="Timeline"><Timeline items={[{ title: 'Design baseline', date: 'Jan', progress: 100 },{ title: 'Procurement release', date: 'Feb', progress: 78 },{ title: 'Site installation', date: 'Mar', progress: 52 },{ title: 'T&C and handover', date: 'Apr', progress: 28 }]} /></Card></div>
      <Card title="WBS timeline register" subtitle="Project data table"><DataTable rows={rows} /></Card>
    </div>
  );
}
