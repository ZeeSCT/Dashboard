'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { pageRegistry } from '@/lib/pageRegistry';
import type { ScreenKey } from '@/data/screens';

export default function AppShell() {
  const [active, setActive] = useState<ScreenKey>('portfolio');
  const ActiveScreen = pageRegistry[active];

  return (
    <div className="shell">
      <Sidebar active={active} onChange={setActive} />
      <div className="main">
        <Topbar active={active} />
        <div className="cnt">
          <ActiveScreen />
        </div>
      </div>
    </div>
  );
}
