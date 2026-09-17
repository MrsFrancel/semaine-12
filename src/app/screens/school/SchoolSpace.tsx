import { useState } from 'react';
import { Shell, type NavItem } from '../../components/product/Shell';
import { AdminDashboardScreen } from './admin/AdminDashboardScreen';
import { OffresScreen } from './admin/OffresScreen';
import { OffresScreenWizard } from './admin/OffresScreenWizard';
import { CvBookScreen } from './admin/CvBookScreen';
import { CoachsScreen } from './admin/CoachsScreen';
import { EtudiantsScreen } from './admin/EtudiantsScreen';
import { ParametresScreen } from './admin/ParametresScreen';
import { CoachDashboardScreen } from './coach/CoachDashboardScreen';
import { MesEtudiantsScreen } from './coach/MesEtudiantsScreen';
import { CalendrierMessagerieScreen } from './coach/CalendrierMessagerieScreen';
import { OFFERS as INITIAL_OFFERS, type Offer } from '../../lib/mock-data';

let nextOfferId = 1000;

const ADMIN_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'offres', label: "Dépôt d'offres", sub: 'Offres & catalogue' },
  { id: 'cvbook', label: 'CV Book' },
  { id: 'coachs', label: 'Coachs' },
  { id: 'etudiants', label: 'Étudiants' },
  { id: 'parametres', label: 'Paramètres' },
];

const COACH_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'etudiants', label: 'Mes étudiants' },
  { id: 'calendrier', label: 'Calendrier & messagerie' },
];

export function SchoolSpace({ role, onExit, abVersion }: { role: 'admin' | 'coach'; onExit: () => void; abVersion: 'A' | 'B' }) {
  const [active, setActive] = useState('dashboard');
  const [coachMessageTarget, setCoachMessageTarget] = useState<number | null>(null);
  const [coachCalendarTab, setCoachCalendarTab] = useState<'calendrier' | 'messagerie'>('calendrier');
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const nav = role === 'admin' ? ADMIN_NAV : COACH_NAV;

  const publishOffer = (draft: Omit<Offer, 'id'>) => {
    setOffers((o) => [{ ...draft, id: nextOfferId++ }, ...o]);
  };
  const removeOffer = (id: number) => setOffers((o) => o.filter((x) => x.id !== id));

  const openMessagerie = (studentId: number) => {
    setCoachMessageTarget(studentId);
    setCoachCalendarTab('messagerie');
    setActive('calendrier');
  };
  const openCalendrier = () => {
    setCoachCalendarTab('calendrier');
    setActive('calendrier');
  };

  const offresProps = { offers, onPublish: publishOffer, onRemoveOffer: removeOffer };

  const renderAdmin = () => {
    switch (active) {
      case 'offres': return abVersion === 'B' ? <OffresScreenWizard {...offresProps} /> : <OffresScreen {...offresProps} />;
      case 'cvbook': return <CvBookScreen />;
      case 'coachs': return <CoachsScreen />;
      case 'etudiants': return <EtudiantsScreen />;
      case 'parametres': return <ParametresScreen />;
      default: return <AdminDashboardScreen {...offresProps} abVersion={abVersion} />;
    }
  };

  const renderCoach = () => {
    switch (active) {
      case 'etudiants': return <MesEtudiantsScreen onMessageStudent={openMessagerie} onProposeRdv={openCalendrier} />;
      case 'calendrier': return (
        <CalendrierMessagerieScreen
          initialTab={coachCalendarTab}
          openStudentId={coachMessageTarget}
          onConsumeOpenStudentId={() => setCoachMessageTarget(null)}
        />
      );
      default: return <CoachDashboardScreen onMessageStudent={openMessagerie} />;
    }
  };

  return (
    <Shell
      spaceLabel="Espace École"
      roleLabel={role === 'admin' ? 'Admin — Camille Dubois' : 'Coach — Karim Haddad'}
      navItems={nav}
      activeId={active}
      onSelect={setActive}
      onExit={onExit}
    >
      {role === 'admin' ? renderAdmin() : renderCoach()}
    </Shell>
  );
}
