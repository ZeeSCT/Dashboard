import Badge from '@/components/shared/Badge';
import Card from '@/components/shared/Card';
import DataTable from '@/components/shared/DataTable';
import DonutChart from '@/components/shared/DonutChart';
import KpiCard from '@/components/shared/KpiCard';
import Timeline from '@/components/shared/Timeline';
import Toolbar from '@/components/shared/Toolbar';

const rows = [
  { name: 'Controller cabinet approval', owner: 'Client', progress: 35, status: 'Critical', color: 'red' as const, amount: '0d float' },
  { name: 'Fiber route permit', owner: 'Authorities', progress: 48, status: 'Critical', color: 'red' as const, amount: '0d float' },
  { name: 'Signal head delivery', owner: 'Supplier', progress: 62, status: 'Low float', color: 'amber' as const, amount: '3d float' },
  { name: 'Road marking interface', owner: 'Civil', progress: 74, status: 'Safe', color: 'green' as const, amount: '12d float' },
];

export default function CriticalFloatView() {
  return (
    <div className="screen">
      <Toolbar />
      <div className="project-context"><select className="pm-project-select"><option>ITS2020 Phase 2 Package 2A</option><option>Al Barsha MEP Works</option><option>DIP Warehouse Complex</option></select><span className="hint">Project-specific critical / float view view</span></div>
      <div className="kr">
        <KpiCard label="Critical path" value="5" subtext="Zero-float items" color="red" />
        <KpiCard label="Low float" value="11" subtext="1-5 days float" color="amber" />
        <KpiCard label="Recoverable" value="18" subtext="Actionable tasks" color="blue" />
        <KpiCard label="Safe float" value="42" subtext="More than 10 days" color="green" />
      </div>
      <div className="grid-two"><Card title="Status split"><DonutChart total="76" segments={[{ label: 'On track', value: 46, color: 'green' },{ label: 'In progress', value: 28, color: 'blue' },{ label: 'At risk', value: 18, color: 'amber' },{ label: 'Critical', value: 8, color: 'red' }]} /></Card><Card title="Timeline"><Timeline items={[{ title: 'Client approval escalation', date: 'Today', progress: 20 },{ title: 'Supplier expediting', date: '+3d', progress: 46 },{ title: 'Resequence civil interface', date: '+5d', progress: 62 }]} /></Card></div>
      <Card title="Critical / float view register" subtitle="Project data table"><DataTable rows={rows} /></Card>
    </div>
  );
}
