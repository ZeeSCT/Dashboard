'use client';

import { useState } from 'react';
import type { NavigationModule, ScreenKey } from '@/data/screens';

const colorVar = (color: string) => {
  if (color === 'blue') return 'var(--bl)';
  if (color === 'green') return 'var(--gn)';
  if (color === 'amber') return 'var(--am)';
  if (color === 'red') return 'var(--rd)';
  if (color === 'purple') return 'var(--pu)';
  if (color === 'teal') return 'var(--tl)';
  return 'var(--t3)';
};

export default function ModuleSection({
  module,
  active,
  onChange,
}: {
  module: NavigationModule;
  active: ScreenKey;
  onChange: (key: ScreenKey) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section className="module-group">
      <button className="ns-hdr module-toggle" type="button" onClick={() => setOpen((value) => !value)}>
        <span className="ns-label">{module.title}</span>
        <svg className={`ns-arrow ${open ? 'open' : 'closed'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={`ns-body ${open ? 'open' : 'closed'}`}>
        {module.items.map((item) => (
          <button key={item.key} className={`ni ${active === item.key ? 'on' : ''}`} onClick={() => onChange(item.key)} type="button">
            <div className="dot" style={{ background: colorVar(item.color) }} />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
