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
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <aside className="w-full md:w-56 flex-none bg-brand text-brand-foreground flex flex-col">
        <div className="px-4 md:px-5 py-4 border-b border-white/10 flex items-center gap-3">
          <Logomark className="size-8 flex-none text-brand-foreground" />
          <div className="min-w-0">
            <h1 className="text-base leading-tight truncate">{spaceLabel}</h1>
            <p className="font-mono text-[11px] text-brand-foreground/60 truncate">{roleLabel}</p>
          </div>
        </div>
        <nav className="flex flex-row md:flex-col gap-0.5 px-2 py-2 md:py-3 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex-none whitespace-nowrap text-left px-3 py-2 rounded text-sm transition-colors ${
                activeId === item.id ? 'bg-primary text-primary-foreground font-medium' : 'text-brand-foreground/75 hover:bg-white/8'
              }`}
            >
              {item.label}
              {item.sub && <span className="block font-mono text-[10px] uppercase tracking-wide opacity-60 font-normal mt-0.5">{item.sub}</span>}
            </button>
          ))}
        </nav>
        <div className="md:mt-auto px-2 py-3 border-t border-white/10">
          <button onClick={onExit} className="font-mono text-[11px] text-brand-foreground/60 hover:text-brand-foreground px-3">
            ← CHANGER D'ESPACE
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-5xl w-full">{children}</main>
    </div>
  );
}
