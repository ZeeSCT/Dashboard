'use client';

import { navigation } from '@/data/navigation';
import type { ScreenKey } from '@/data/screens';
import ModuleSection from './ModuleSection';

export default function Sidebar({ active, onChange }: { active: ScreenKey; onChange: (key: ScreenKey) => void }) {
  return (
    <nav className="side">
      <div className="logo"><img src="../logo.png" alt="logo" width={120} height={54}/> <span>Unified Platform</span></div>
      {navigation.map((module) => (
        <ModuleSection key={module.key} module={module} active={active} onChange={onChange} />
      ))}
      <div className="menu-foot"><strong>Menu check:</strong> 6 main modules, 41 linked screens. Sections can be collapsed or expanded.</div>
    </nav>
  );
}
