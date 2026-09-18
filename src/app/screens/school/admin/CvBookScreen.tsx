import { useState, useRef } from 'react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { useCvPreview, CvPreviewDialogs } from '../../../components/product/CvPreview';
import { STUDENTS, studentEmail, studentPhone, softSkillsFor, slugify, type Student } from '../../../lib/mock-data';
import { useSkillVocabulary } from '../../../lib/skill-vocabulary';
import { analyzeOfferText, type OfferAnalysis } from '../../../lib/text-analysis';
import { extractPdfText } from '../../../lib/pdf-extract';
import { skillsOverlapScore } from '../../../lib/scoring';
import { exportTextAsPdf } from '../../../lib/export';

type Step = 'reception' | 'traitement' | 'apercu' | 'classement';

interface CvBookHistoryEntry {
  id: number;
  date: string;
  offerTitle: string;
  offerLocation: string;
  offerContractType: string;
  offerSkills: string[];
  profiles: { studentId: number; score: number }[];
}

function splitName(fullName: string): { prenom: string; nom: string } {
  const [prenom, ...rest] = fullName.split(' ');
  return { prenom, nom: rest.join(' ') };
}

function formatStudentCvForExport(student: Student, score: number): string {
  const sections = [
    `${student.name} (${score}% de match)`,
    `${student.promo}`,
    `${studentEmail(student)} · ${studentPhone(student)}`,
    student.cv.title && `Titre\n${student.cv.title}`,
    student.cv.bio && `Présentation\n${student.cv.bio}`,
    `Formation\n${student.cv.formation}`,
    `Expérience\n${student.cv.experience}`,
    `Compétences techniques\n${student.cv.hardSkills.join(', ')}`,
    student.cv.certifications.length > 0 && `Certifications\n${student.cv.certifications.join(', ')}`,
    `Savoir-être\n${softSkillsFor(student).join(', ')}`,
  ];
  return sections.filter(Boolean).join('\n\n');
}

let nextHistoryId = 1;

export function CvBookScreen() {
  const [step, setStep] = useState<Step>('reception');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [analysis, setAnalysis] = useState<OfferAnalysis | null>(null);
  const [history, setHistory] = useState<CvBookHistoryEntry[]>([]);
  const cvPreview = useCvPreview();
  const { vocabulary } = useSkillVocabulary();

  const canImport = text.trim().length > 0 || fileName.length > 0;

  const startImport = async () => {
    setStep('traitement');
    const content = file ? await extractPdfText(file) : text;
    const result = analyzeOfferText(content, vocabulary);
    setAnalysis(result);
    setStep('apercu');
  };

  const ranked = analysis
    ? [...STUDENTS]
        .map((s) => ({ student: s, ...skillsOverlapScore(analysis.skills, [...s.cv.hardSkills, ...s.cv.certifications]) }))
        .sort((a, b) => b.score - a.score)
    : [];
  const toggle = (id: number) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const backToHome = () => {
    setStep('reception'); setText(''); setFileName(''); setFile(null); setAnalysis(null); setSelected([]);
  };

  const downloadSelected = () => {
    if (!analysis) return;
    const chosen = ranked.filter((r) => selected.includes(r.student.id));
    const offerTitle = analysis.title || 'Offre reçue';
    const body = chosen.map(({ student, score }) => formatStudentCvForExport(student, score)).join('\n\n──────────\n\n');
    exportTextAsPdf(`cv-book-${slugify(offerTitle)}`, `CV Book — ${offerTitle}`, body);

    setHistory((h) => [{
      id: nextHistoryId++,
      date: "à l'instant",
      offerTitle,
      offerLocation: analysis.location || 'Lieu non précisé',
      offerContractType: analysis.contractType || 'Contrat non précisé',
      offerSkills: analysis.skills,
      profiles: chosen.map(({ student, score }) => ({ studentId: student.id, score })),
    }, ...h]);

    backToHome();
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl">CV Book</h2>
        <p className="text-muted-foreground text-sm mt-1">Une entreprise vous transmet une offre : on classe toute la base étudiante par pertinence.</p>
      </div>

      {step !== 'classement' && (
        <Card>
          <CardHeader><h3 className="text-base">Offre reçue</h3></CardHeader>
          <CardContent className="flex flex-col gap-4">
            {step === 'reception' && (
              <>
                <Tabs defaultValue="texte">
                  <TabsList>
                    <TabsTrigger value="texte">Texte</TabsTrigger>
                    <TabsTrigger value="pdf">Fichier PDF</TabsTrigger>
                  </TabsList>
                  <TabsContent value="texte" className="mt-3">
                    <Textarea placeholder="Colle le mail ou le texte transmis par l'entreprise" value={text} onChange={(e) => { setText(e.target.value); setFileName(''); setFile(null); }} />
                  </TabsContent>
                  <TabsContent value="pdf" className="mt-3">
                    <div className="flex items-center gap-3">
                      <input ref={fileInput} type="file" accept="application/pdf" className="hidden" id="cvbook-pdf"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFileName(f.name); setFile(f); setText(''); } }} />
                      <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>Choisir un PDF</Button>
                      <span className="text-sm text-muted-foreground">{fileName || 'Aucun fichier sélectionné'}</span>
                    </div>
                  </TabsContent>
                </Tabs>
                <Button onClick={startImport} disabled={!canImport} className="w-fit">Analyser l'offre</Button>
              </>
            )}
            {step === 'traitement' && <p className="text-sm text-muted-foreground py-4">Extraction de l'offre en cours…</p>}
            {step === 'apercu' && analysis && (
              <>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium">{analysis.title || 'Offre reçue'}</p>
                  <p className="text-xs text-muted-foreground mt-1">{analysis.location || 'Lieu non précisé'} · {analysis.contractType || 'Contrat non précisé'}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {analysis.skills.length ? `Compétences recherchées : ${analysis.skills.join(', ')}` : 'Aucune compétence connue repérée dans le texte.'}
                  </p>
                </div>
                <Button onClick={() => setStep('classement')} className="w-fit">Classer les profils sur cette offre</Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {step === 'classement' && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <h3 className="text-base">Profils classés par pertinence ({ranked.length})</h3>
            <Button variant="ghost" size="sm" onClick={backToHome}>Nouvelle offre</Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {ranked.map(({ student, score }) => (
              <div key={student.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                <label className="flex items-center gap-3 cursor-pointer min-w-0">
                  <input type="checkbox" checked={selected.includes(student.id)} onChange={() => toggle(student.id)} className="accent-primary flex-none" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{student.promo}</p>
                  </div>
                </label>
                <div className="flex items-center gap-3 flex-none">
                  <span className="font-mono text-sm text-primary font-semibold">{score}%</span>
                  <Button variant="ghost" size="sm" onClick={() => cvPreview.setPreviewStudent(student)}>Voir le CV</Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-fit mt-1" disabled={!selected.length} onClick={downloadSelected}>
              Télécharger {selected.length || ''} CV sélectionné{selected.length > 1 ? 's' : ''}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'reception' && history.length > 0 && (
        <Card>
          <CardHeader><h3 className="text-base">Historique des CV Book ({history.length})</h3></CardHeader>
          <CardContent className="flex flex-col gap-5">
            {history.map((entry) => (
              <div key={entry.id} className="flex flex-col gap-3 rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{entry.offerTitle}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{entry.offerLocation} · {entry.offerContractType}</p>
                    {entry.offerSkills.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">Compétences recherchées : {entry.offerSkills.join(', ')}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex-none">{entry.date}</span>
                </div>
                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-mono">
                    Profils envoyés ({entry.profiles.length})
                  </p>
                  {entry.profiles.map(({ studentId, score }) => {
                    const student = STUDENTS.find((s) => s.id === studentId);
                    if (!student) return null;
                    const { prenom, nom } = splitName(student.name);
                    return (
                      <div key={studentId} className="flex items-center justify-between text-sm">
                        <div className="min-w-0">
                          <p className="truncate">{prenom} {nom}</p>
                          <p className="text-xs text-muted-foreground truncate">{student.promo}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-none">
                          <span className="font-mono text-sm text-primary font-semibold">{score}%</span>
                          <Button variant="ghost" size="sm" onClick={() => cvPreview.setPreviewStudent(student)}>Voir le CV</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <CvPreviewDialogs {...cvPreview} />
    </div>
  );
}
