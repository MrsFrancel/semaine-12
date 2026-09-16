import { useState } from 'react';
import { Shell, type NavItem } from '../../components/product/Shell';
import { CatalogueScreen } from './CatalogueScreen';
import { CandidatureScreen } from './CandidatureScreen';
import { MonCvScreen } from './MonCvScreen';
import { MonSuiviScreen } from './MonSuiviScreen';
import { STUDENTS, CURRENT_STUDENT_ID, defaultCvFor, type Offer, type CvData } from '../../lib/mock-data';

const NAV: NavItem[] = [
  { id: 'offres', label: 'Offres', sub: 'École + externes' },
  { id: 'cv', label: 'Mon CV' },
  { id: 'suivi', label: 'Mon suivi' },
];

const CURRENT_STUDENT = STUDENTS.find((s) => s.id === CURRENT_STUDENT_ID)!;

export function StudentSpace({ onExit }: { onExit: () => void }) {
  const [active, setActive] = useState('offres');
  const [openOffer, setOpenOffer] = useState<Offer | null>(null);
  const [profileCv, setProfileCv] = useState<CvData>(() => defaultCvFor(CURRENT_STUDENT));

  const select = (id: string) => { setOpenOffer(null); setActive(id); };

  return (
    <Shell spaceLabel="Espace Étudiant" roleLabel="Léa Bernard" navItems={NAV} activeId={active} onSelect={select} onExit={onExit}>
      {openOffer ? (
        <CandidatureScreen offer={openOffer} profileCv={profileCv} onPushProfileCv={setProfileCv} onBack={() => setOpenOffer(null)} />
      ) : active === 'offres' ? (
        <CatalogueScreen onOpenOffer={setOpenOffer} />
      ) : active === 'cv' ? (
        <MonCvScreen cv={profileCv} />
      ) : (
        <MonSuiviScreen />
      )}
    </Shell>
  );
}
