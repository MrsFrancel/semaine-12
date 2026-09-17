import { useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { OfferCard } from '../../components/product/OfferCard';
import { OFFERS, type Offer } from '../../lib/mock-data';
import { useSkillVocabulary } from '../../lib/skill-vocabulary';
import { analyzeOfferText, type OfferAnalysis } from '../../lib/text-analysis';
import { extractPdfText } from '../../lib/pdf-extract';

let nextExternalId = 200;

export function buildExternalOffer(analysis: OfferAnalysis): Offer {
  return {
    id: nextExternalId++,
    title: analysis.title || 'Offre externe',
    company: 'Entreprise (offre externe)',
    location: analysis.location || 'Lieu non précisé',
    type: analysis.contractType || 'Contrat non précisé',
    score: 60,
    criteria: [
      {
        name: 'Compétences techniques', level: 'mid', fill: 55,
        note: analysis.skills.length ? `Compétences repérées dans le texte : ${analysis.skills.join(', ')}.` : "Aucune compétence connue repérée dans le texte, à vérifier.",
      },
      { name: 'Expérience', level: 'mid', fill: 50, note: 'Pas encore évalué pour ce profil.' },
      {
        name: 'Mots-clés du secteur', level: 'mid', fill: 50,
        note: analysis.profile ? `Niveau attendu repéré : ${analysis.profile}.` : 'Profil recherché non précisé dans le texte.',
      },
    ],
    expectedSkills: analysis.skills,
    description: analysis.description,
    missions: [],
    exclusive: false,
  };
}

export function CatalogueScreen({
  externalOffers,
  onAddExternalOffer,
  onOpenOffer,
}: {
  externalOffers: Offer[];
  onAddExternalOffer: (offer: Offer) => void;
  onOpenOffer: (offer: Offer) => void;
}) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [checking, setChecking] = useState(false);
  const { vocabulary } = useSkillVocabulary();
  const canCheck = text.trim().length > 0 || !!file;

  const check = async () => {
    if (!canCheck) return;
    setChecking(true);
    try {
      const content = file ? await extractPdfText(file) : text;
      const analysis = analyzeOfferText(content, vocabulary);
      setChecking(false);
      setText('');
      setFile(null);
      onAddExternalOffer(buildExternalOffer(analysis));
    } catch {
      setChecking(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl">Offres</h2>
        <p className="text-muted-foreground text-sm mt-1">Le catalogue école reste séparé de tes propres offres : les deux ne se mélangent jamais.</p>
      </div>

      <Tabs defaultValue="ecole">
        <TabsList>
          <TabsTrigger value="ecole">Offres école ({OFFERS.length})</TabsTrigger>
          <TabsTrigger value="externes">Offres externes ({externalOffers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="ecole" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OFFERS.map((o) => <OfferCard key={o.id} offer={o} onOpen={() => onOpenOffer(o)} />)}
          </div>
        </TabsContent>

        <TabsContent value="externes" className="mt-4 flex flex-col gap-5">
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
            <p className="text-sm font-medium">Vérifier une nouvelle offre</p>
            <Tabs defaultValue="texte">
              <TabsList>
                <TabsTrigger value="texte">Texte</TabsTrigger>
                <TabsTrigger value="pdf">Fichier PDF</TabsTrigger>
              </TabsList>
              <TabsContent value="texte" className="mt-3">
                <Textarea
                  placeholder="Colle le texte de l'offre (mail, description...)"
                  value={text}
                  onChange={(e) => { setText(e.target.value); setFile(null); }}
                />
              </TabsContent>
              <TabsContent value="pdf" className="mt-3">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInput}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    id="offre-externe-pdf"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setText(''); } }}
                  />
                  <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>Choisir un PDF</Button>
                  <span className="text-sm text-muted-foreground truncate">{file?.name || 'Aucun fichier sélectionné'}</span>
                </div>
              </TabsContent>
            </Tabs>
            <Button onClick={check} disabled={checking || !canCheck} className="w-fit">{checking ? 'Analyse…' : 'Vérifier'}</Button>
            <p className="text-xs text-muted-foreground">Usage privé : ces offres ne rejoignent jamais le catalogue de l'école. Une fois vérifiée, l'offre s'ajoute à ton historique et s'ouvre directement, comme une offre école.</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-3">Historique de tes offres vérifiées</p>
            {externalOffers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune offre vérifiée pour l'instant. Colle un texte ou dépose un PDF ci-dessus pour commencer.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {externalOffers.map((o) => <OfferCard key={o.id} offer={o} onOpen={() => onOpenOffer(o)} />)}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
