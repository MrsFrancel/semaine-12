import { useRef } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { TagList, TagAdder } from '../ui/tag-editor';
import type { CvData } from '../../lib/mock-data';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground pt-1">{children}</p>;
}

export function CvFieldsEditor({ cv, onChange }: { cv: CvData; onChange: (updater: (d: CvData) => CvData) => void }) {
  const photoInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof CvData>(key: K, value: CvData[K]) => onChange((d) => ({ ...d, [key]: value }));

  const addHardSkill = (skill: string) => {
    if (cv.hardSkills.some((s) => s.toLowerCase() === skill.toLowerCase())) return;
    onChange((d) => ({ ...d, hardSkills: [...d.hardSkills, skill] }));
  };
  const removeHardSkill = (skill: string) => onChange((d) => ({ ...d, hardSkills: d.hardSkills.filter((s) => s !== skill) }));

  const addCertification = (cert: string) => {
    if (cv.certifications.some((c) => c.toLowerCase() === cert.toLowerCase())) return;
    onChange((d) => ({ ...d, certifications: [...d.certifications, cert] }));
  };
  const removeCertification = (cert: string) => onChange((d) => ({ ...d, certifications: d.certifications.filter((c) => c !== cert) }));

  const onPhotoSelected = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('photoUrl', String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionLabel>Profil</SectionLabel>
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1.5 flex-none">
          <button
            type="button"
            onClick={() => photoInput.current?.click()}
            className="size-16 rounded-full bg-secondary border border-border overflow-hidden flex items-center justify-center text-[10px] text-muted-foreground hover:border-primary/50 transition-colors"
          >
            {cv.photoUrl ? <img src={cv.photoUrl} alt="Photo de profil" className="size-full object-cover" /> : 'Photo'}
          </button>
          <input
            ref={photoInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPhotoSelected(e.target.files?.[0])}
          />
          {cv.photoUrl && (
            <button type="button" onClick={() => set('photoUrl', '')} className="text-[11px] text-muted-foreground hover:text-foreground">
              Retirer
            </button>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <Field label="Titre" hint="Optionnel — l'accroche que verra un recruteur en premier.">
            <Input placeholder="Ex. Chargée de marketing digital en recherche d'alternance" value={cv.title} onChange={(e) => set('title', e.target.value)} />
          </Field>
          <Field label="Présentation" hint="Optionnel — quelques lignes sur toi.">
            <Textarea className="min-h-16" value={cv.bio} onChange={(e) => set('bio', e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Téléphone" hint="Optionnel">
          <Input value={cv.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <Field label="Email de contact" hint="Optionnel">
          <Input value={cv.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} />
        </Field>
      </div>

      <SectionLabel>Formation &amp; expérience</SectionLabel>
      <Field label="Formation">
        <Input placeholder="Ex. Bachelor Marketing Digital, HETIC" value={cv.formation} onChange={(e) => set('formation', e.target.value)} />
      </Field>
      <Field label="Expérience">
        <Textarea className="min-h-24" placeholder="Ex. Stage 6 mois, chargé de communication digitale. Missions principales." value={cv.experience} onChange={(e) => set('experience', e.target.value)} />
      </Field>
      <Field label="Projets personnels ou associatifs" hint="Optionnel — un projet mené hors cadre scolaire ou pro.">
        <Textarea className="min-h-16" value={cv.personalProjects} onChange={(e) => set('personalProjects', e.target.value)} />
      </Field>

      <SectionLabel>Compétences</SectionLabel>
      <Field label="Compétences techniques">
        <TagList values={cv.hardSkills} onRemove={removeHardSkill} tone="primary" />
        <TagAdder placeholder="Ajouter une compétence…" onAdd={addHardSkill} />
      </Field>
      <Field label="Certifications" hint="Optionnel">
        <TagList values={cv.certifications} onRemove={removeCertification} />
        <TagAdder placeholder="Ex. Google Ads, HubSpot Academy…" onAdd={addCertification} />
      </Field>
      <Field label="Savoir-être (séparés par une virgule)">
        <Input
          value={cv.softSkills.join(', ')}
          onChange={(e) => set('softSkills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
        />
      </Field>
      <Field label="Langues">
        <Input value={cv.languages} onChange={(e) => set('languages', e.target.value)} />
      </Field>

      <SectionLabel>Complémentaire</SectionLabel>
      <Field label="Portfolio / liens" hint="Optionnel — LinkedIn, Behance, GitHub, site perso…">
        <Textarea className="min-h-12" placeholder="Ex. linkedin.com/in/…, behance.net/…" value={cv.portfolioLinks} onChange={(e) => set('portfolioLinks', e.target.value)} />
      </Field>
      <Field label="Centres d'intérêt" hint="Optionnel">
        <Input value={cv.interests} onChange={(e) => set('interests', e.target.value)} />
      </Field>
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
        <div>
          <p className="text-sm">Permis de conduire</p>
          <p className="text-[11px] text-muted-foreground">Optionnel — utile seulement si l'offre le demande.</p>
        </div>
        <Switch checked={cv.drivingLicense} onCheckedChange={(v) => set('drivingLicense', v)} />
      </div>
      <Field label="Disponibilité / mobilité géographique" hint="Optionnel">
        <Input placeholder="Ex. Disponible dès septembre, mobile Île-de-France" value={cv.availability} onChange={(e) => set('availability', e.target.value)} />
      </Field>
      <Field label="Note d'attention" hint="Optionnel — une note personnelle : ta présentation, ou ce que tu recherches.">
        <Textarea className="min-h-16" value={cv.attentionNote} onChange={(e) => set('attentionNote', e.target.value)} />
      </Field>
    </div>
  );
}
