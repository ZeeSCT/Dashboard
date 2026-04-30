import type { ColorKey } from '@/data/screens';
export default function Badge({children,color='blue'}:{children:React.ReactNode;color?:ColorKey}){return <span className={`badge badge-${color}`}>{children}</span>}
