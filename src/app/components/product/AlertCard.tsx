export function InactivityAlert({ name, days }: { name: string; days: number }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary p-4">
      <span className="mt-1.5 size-2 rounded-full bg-muted-foreground flex-none" />
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Aucune candidature envoyée depuis {days} jours. Aucun score de profil associé à ce signal.
        </p>
      </div>
    </div>
  );
}
