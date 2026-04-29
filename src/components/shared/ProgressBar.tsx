import type { ColorKey } from '@/data/screens';
export default function ProgressBar({value,color='blue'}:{value:number;color?:ColorKey}){return <div className="progress-wrap"><div className="progress-track"><div className={`progress-fill fill-${color}`} style={{width:`${value}%`}}/></div><span>{value}%</span></div>}
