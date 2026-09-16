import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { StatusPill } from '../../components/product/StatusPill';
import { CANDIDATURES, OFFERS, EXTERNAL_OFFERS } from '../../lib/mock-data';

const ALL_OFFERS = [...OFFERS, ...EXTERNAL_OFFERS];

export function MonSuiviScreen() {
  const rows = CANDIDATURES.map((c) => ({ c, offer: ALL_OFFERS.find((o) => o.id === c.offerId)! })).filter((r) => r.offer);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl">Mon suivi</h2>
        <p className="text-muted-foreground text-sm mt-1">Ton activité de recherche, sans jamais te noter.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{CANDIDATURES.length}</p><p className="text-xs text-muted-foreground mt-1">Candidatures ce mois-ci</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{CANDIDATURES.filter(c => c.status === 'entretien' || c.status === 'reponse').length}</p><p className="text-xs text-muted-foreground mt-1">Entretiens obtenus</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{OFFERS.filter(o => o.score >= 75).length}</p><p className="text-xs text-muted-foreground mt-1">Bons matchs au catalogue</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><h3 className="text-base">Mes candidatures</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {rows.map(({ c, offer }) => (
            <div key={offer.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
              <div>
                <p className="text-sm font-medium">{offer.title}</p>
                <p className="text-xs text-muted-foreground">{offer.company} · mise à jour le {c.updatedAt}</p>
              </div>
              <StatusPill status={c.status} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="text-base">Messagerie &amp; rendez-vous</h3></CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Ton coach : Camille Dubois</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Prendre RDV</Button>
            <Button variant="ghost" size="sm">Ouvrir le chat</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
