import { useState } from 'react';
import { Input } from './input';

export function TagList({
  values,
  onRemove,
  tone = 'neutral',
}: {
  values: string[];
  onRemove: (value: string) => void;
  tone?: 'neutral' | 'primary';
}) {
  if (values.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v) => (
        <span
          key={v}
          className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded border ${
            tone === 'primary' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-secondary text-secondary-foreground border-transparent'
          }`}
        >
          {v}
          <button type="button" onClick={() => onRemove(v)} className="hover:opacity-70" aria-label={`Retirer ${v}`}>×</button>
        </span>
      ))}
    </div>
  );
}

export function TagAdder({ placeholder, onAdd }: { placeholder: string; onAdd: (value: string) => void }) {
  const [draft, setDraft] = useState('');
  const commit = () => {
    if (draft.trim()) onAdd(draft.trim());
    setDraft('');
  };
  return (
    <div className="flex gap-2 mt-1">
      <Input
        placeholder={placeholder}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
      />
      <button type="button" onClick={commit} className="text-xs px-3 rounded-md border border-border text-muted-foreground hover:text-foreground flex-none">
        Ajouter
      </button>
    </div>
  );
}
