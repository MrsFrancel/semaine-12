import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { ScoreCard } from '../../components/product/ScoreCard';
import { StatusPill } from '../../components/product/StatusPill';
import type { Offer, CandidatureStatus } from '../../lib/mock-data';
import { STATUS_LABEL } from '../../lib/mock-data';

const ORDER: CandidatureStatus[] = ['a-preparer', 'postulee', 'entretien', 'reponse'];

export function CandidatureScreen({ offer, onBack }: { offer: Offer; onBack: () => void }) {
  const [status, setStatus] = useState<CandidatureStatus>('a-preparer');
  const [letterGenerated, setLetterGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const advance = () => {
    const i = ORDER.indexOf(status);
    if (i < ORDER.length - 1) setStatus(ORDER[i + 1]);
  };

  const generateLetter = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setLetterGenerated(true); }, 1100);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground w-fit">← Retour au catalogue</button>

      <ScoreCard offer={offer} />

      <Card>
        <CardHeader><h3 className="text-base">CV &amp; lettre de motivation</h3></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">CV adapté à cette offre</p>
              <p className="text-xs text-muted-foreground">Édition manuelle ou assistée par IA, chaque suggestion reste à valider.</p>
            </div>
            <Button variant="outline" size="sm">Adapter mon CV</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Lettre de motivation</p>
              <p className="text-xs text-muted-foreground">{letterGenerated ? 'Générée, à relire avant envoi.' : 'Pas encore générée.'}</p>
            </div>
            <Button variant="outline" size="sm" onClick={generateLetter} disabled={generating}>
              {generating ? 'Génération…' : letterGenerated ? 'Régénérer' : 'Générer'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <h3 className="text-base">Statut de ta candidature</h3>
          <StatusPill status={status} />
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          {status !== 'reponse' ? (
            <Button onClick={advance}>
              {status === 'a-preparer' ? 'Marquer comme postulée' : status === 'postulee' ? "J'ai un entretien" : 'Marquer la réponse reçue'}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">Candidature clôturée : {STATUS_LABEL[status]}.</p>
          )}
        </CardContent>
      </Card>

      {status === 'entretien' && (
        <Card className="border-primary/30">
          <CardHeader><h3 className="text-base">Préparer l'entretien avec ton coach</h3></CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" size="sm">Prendre rendez-vous</Button>
            <Button variant="ghost" size="sm">Ouvrir la messagerie</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
