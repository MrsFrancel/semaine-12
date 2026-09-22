import { Card, CardContent } from '../components/ui/card';

export function LoginScreen({
  onPick,
  abVersion,
  onPickAbVersion,
}: {
  onPick: (space: 'student-onboarding' | 'student' | 'admin' | 'coach') => void;
  abVersion: 'A' | 'B';
  onPickAbVersion: (version: 'A' | 'B') => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-widest text-primary">Match&amp;Go</p>
          <h1 className="text-3xl mt-2">Cible les offres où tu as une vraie chance.</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 gap-3 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onPick('student-onboarding')}>
            <h3 className="text-base">Étudiant</h3>
            <p className="text-xs text-muted-foreground">Nouvelle inscription, avec le parcours d'onboarding complet.</p>
          </Card>
          <Card className="p-5 gap-3 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onPick('admin')}>
            <h3 className="text-base">École · Admin</h3>
            <p className="text-xs text-muted-foreground">Gouvernance : accès, coachs, paramètres.</p>
          </Card>
          <Card className="p-5 gap-3 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onPick('coach')}>
            <h3 className="text-base">École · Coach</h3>
            <p className="text-xs text-muted-foreground">Terrain : suivi étudiants, messagerie, RDV.</p>
          </Card>
        </div>

        <div className="rounded-xl border border-border bg-secondary p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Test AB · Dépôt d'offres</p>
            <p className="text-xs text-muted-foreground mt-0.5">Choisis la version avant d'entrer dans l'espace École.</p>
          </div>
          <div className="flex gap-1.5 flex-none">
            <button
              type="button"
              onClick={() => onPickAbVersion('A')}
              className={`font-mono text-xs px-3 py-1.5 rounded-md border transition-colors ${
                abVersion === 'A' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              Version A
            </button>
            <button
              type="button"
              onClick={() => onPickAbVersion('B')}
              className={`font-mono text-xs px-3 py-1.5 rounded-md border transition-colors ${
                abVersion === 'B' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              Version B
            </button>
          </div>
        </div>

        <CardContent className="text-center text-xs text-muted-foreground pt-0">
          Prototype de démonstration, sans authentification réelle.
        </CardContent>
      </div>
    </div>
  );
}
