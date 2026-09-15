import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { STUDENTS } from '../../../lib/mock-data';

const RANKED = [
  { student: STUDENTS[1], score: 91 },
  { student: STUDENTS[0], score: 84 },
  { student: STUDENTS[3], score: 72 },
  { student: STUDENTS[2], score: 58 },
];

export function CvBookScreen() {
  const [source, setSource] = useState('');
  const [ranked, setRanked] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const search = () => { if (source.trim()) setRanked(true); };
  const toggle = (id: number) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="font-serif text-2xl">CV Book</h2>
        <p className="text-muted-foreground text-sm mt-1">Une entreprise vous transmet une offre : on classe toute la base étudiante par pertinence.</p>
      </div>

      <Card>
        <CardHeader><h3 className="font-serif text-base">Offre reçue</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Textarea placeholder="Colle le lien, le mail ou le contenu du PDF transmis par l'entreprise" value={source} onChange={(e) => setSource(e.target.value)} />
          <Button onClick={search} className="w-fit">Classer les profils</Button>
        </CardContent>
      </Card>

      {ranked && (
        <Card>
          <CardHeader><h3 className="font-serif text-base">Profils classés par pertinence</h3></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {RANKED.map(({ student, score }) => (
              <label key={student.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={selected.includes(student.id)} onChange={() => toggle(student.id)} className="accent-primary" />
                  <div>
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.promo}</p>
                  </div>
                </div>
                <span className="font-mono text-sm text-primary font-semibold">{score}%</span>
              </label>
            ))}
            <Button variant="outline" className="w-fit mt-1" disabled={!selected.length}>
              Télécharger {selected.length || ''} CV sélectionné{selected.length > 1 ? 's' : ''}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
