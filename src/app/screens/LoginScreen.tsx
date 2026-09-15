import { Card, CardContent } from '../components/ui/card';

export function LoginScreen({ onPick }: { onPick: (space: 'student-onboarding' | 'student' | 'admin' | 'coach') => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary">Match&amp;Go</p>
          <h1 className="font-serif text-3xl mt-2">Cible les offres où tu as une vraie chance.</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 gap-3 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onPick('student-onboarding')}>
            <h3 className="font-serif text-base">Étudiant</h3>
            <p className="text-xs text-muted-foreground">Nouvelle inscription — parcours d'onboarding complet.</p>
          </Card>
          <Card className="p-5 gap-3 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onPick('admin')}>
            <h3 className="font-serif text-base">École — Admin</h3>
            <p className="text-xs text-muted-foreground">Gouvernance : accès, coachs, paramètres.</p>
          </Card>
          <Card className="p-5 gap-3 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onPick('coach')}>
            <h3 className="font-serif text-base">École — Coach</h3>
            <p className="text-xs text-muted-foreground">Terrain : suivi étudiants, messagerie, RDV.</p>
          </Card>
        </div>
        <CardContent className="text-center text-xs text-muted-foreground pt-0">
          Prototype de démonstration — aucune authentification réelle.
        </CardContent>
      </div>
    </div>
  );
}
