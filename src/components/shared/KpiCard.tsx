import type { ColorKey } from '@/data/screens';
export default function KpiCard({label,value,subtext,color='blue'}:{label:string;value:string;subtext?:string;color?:ColorKey}){return <div className={`kpi kpi-${color}`}><div className="kpi-label">{label}</div><div className="kpi-value">{value}</div>{subtext&&<div className="kpi-subtext">{subtext}</div>}</div>}
