interface Props { label:string; value:string; helper:string; }
export function KPICard({label,value,helper}:Props){ return <div className="kpi-card"><span>{label}</span><strong>{value}</strong><small>{helper}</small></div>; }
