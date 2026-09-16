import type { ReactNode } from 'react';
import { Logomark } from './Logomark';

export interface NavItem {
  id: string;
  label: string;
  sub?: string;
}

export function Shell({
  spaceLabel,
  roleLabel,
  navItems,
  activeId,
  onSelect,
  onExit,
  children,
}: {
  spaceLabel: string;
  roleLabel: string;
  navItems: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onExit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-56 flex-none bg-brand text-brand-foreground flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2 text-brand-foreground/70">
            <Logomark className="size-4" />
            <p className="font-mono text-[11px] uppercase tracking-widest">Match&amp;Go</p>
          </div>
          <h1 className="text-base mt-1">{spaceLabel}</h1>
          <p className="font-mono text-[11px] text-brand-foreground/60 mt-0.5">{roleLabel}</p>
        </div>
        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`text-left px-3 py-2 rounded text-sm transition-colors ${
                activeId === item.id ? 'bg-primary text-primary-foreground font-medium' : 'text-brand-foreground/75 hover:bg-white/8'
              }`}
            >
              {item.label}
              {item.sub && <span className="block font-mono text-[10px] uppercase tracking-wide opacity-60 font-normal mt-0.5">{item.sub}</span>}
            </button>
          ))}
        </nav>
        <div className="px-2 py-3 border-t border-white/10">
          <button onClick={onExit} className="font-mono text-[11px] text-brand-foreground/60 hover:text-brand-foreground px-3">
            ← CHANGER D'ESPACE
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 px-8 py-8 max-w-5xl">{children}</main>
    </div>
  );
}
