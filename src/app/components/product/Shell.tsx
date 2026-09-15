import type { ReactNode } from 'react';

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
      <aside className="w-64 flex-none bg-brand text-brand-foreground flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-mono text-[11px] uppercase tracking-widest text-brand-foreground/60">Match&amp;Go</p>
          <h1 className="font-serif text-lg mt-1">{spaceLabel}</h1>
          <p className="text-xs text-brand-foreground/70 mt-0.5">{roleLabel}</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeId === item.id ? 'bg-white/15 font-medium' : 'text-brand-foreground/75 hover:bg-white/8'
              }`}
            >
              {item.label}
              {item.sub && <span className="block text-[11px] text-brand-foreground/50 font-normal mt-0.5">{item.sub}</span>}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <button onClick={onExit} className="text-xs text-brand-foreground/60 hover:text-brand-foreground px-3">
            ← Changer d'espace
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 px-8 py-8 max-w-5xl">{children}</main>
    </div>
  );
}
