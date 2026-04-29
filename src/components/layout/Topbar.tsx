'use client';

import { screenTitles, type ScreenKey } from '@/data/screens';

export default function Topbar({ active }: { active: ScreenKey }) {
  return (
    <div className="bar">
      <span className="bar-title" id="ttl">{screenTitles[active]}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
        <span className="bbd" style={{ display: active.startsWith('tender') ? 'none' : 'inline-block' }}>PM &amp; Engineer</span>
        <span className="bbd" style={{ display: active.startsWith('tender') ? 'inline-block' : 'none', background: 'var(--pbg)', color: 'var(--pt)' }}>Tender</span>
      </div>
      <div className="bar-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="global-search" placeholder="Search all portfolios..." />
        <span className="bar-kbd">Ctrl+K</span>
      </div>
      <div className="bar-gap" />
      <select className="bar-drop" id="port-filter">
        <option value="all">All portfolios</option>
        <option value="its">ITS Projects</option>
        <option value="traffic">Traffic Projects</option>
        <option value="its-maint">ITS Maintenance</option>
        <option value="traffic-maint">Traffic Maintenance</option>
      </select>
      <button className="bar-pill on" id="btn-allport">All portfolios</button>
      <button className="bar-export">Export</button>
    </div>
  );
}
