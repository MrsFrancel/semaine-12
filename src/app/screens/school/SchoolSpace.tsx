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

const ADMIN_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'offres', label: 'Agrégateur', sub: 'Offres & catalogue' },
  { id: 'cvbook', label: 'CV Book' },
  { id: 'coachs', label: 'Coachs' },
  { id: 'etudiants', label: 'Étudiants' },
  { id: 'parametres', label: 'Paramètres' },
];

const COACH_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'etudiants', label: 'Mes étudiants' },
  { id: 'offres', label: 'Agrégateur' },
  { id: 'cvbook', label: 'CV Book' },
  { id: 'calendrier', label: 'Calendrier & messagerie' },
];

export function SchoolSpace({ role, onExit, abVersion }: { role: 'admin' | 'coach'; onExit: () => void; abVersion: 'A' | 'B' }) {
  const [active, setActive] = useState('dashboard');
  const [coachMessageTarget, setCoachMessageTarget] = useState<number | null>(null);
  const [coachCalendarTab, setCoachCalendarTab] = useState<'calendrier' | 'messagerie'>('calendrier');
  const nav = role === 'admin' ? ADMIN_NAV : COACH_NAV;

  const openMessagerie = (studentId: number) => {
    setCoachMessageTarget(studentId);
    setCoachCalendarTab('messagerie');
    setActive('calendrier');
  };
  const openCalendrier = () => {
    setCoachCalendarTab('calendrier');
    setActive('calendrier');
  };

  const renderAdmin = () => {
    switch (active) {
      case 'offres': return abVersion === 'B' ? <OffresScreenWizard /> : <OffresScreen />;
      case 'cvbook': return <CvBookScreen />;
      case 'coachs': return <CoachsScreen />;
      case 'etudiants': return <EtudiantsScreen />;
      case 'parametres': return <ParametresScreen />;
      default: return <AdminDashboardScreen />;
    }
  };

  const renderCoach = () => {
    switch (active) {
      case 'etudiants': return <MesEtudiantsScreen onMessageStudent={openMessagerie} onProposeRdv={openCalendrier} />;
      case 'offres': return abVersion === 'B' ? <OffresScreenWizard /> : <OffresScreen />;
      case 'cvbook': return <CvBookScreen />;
      case 'calendrier': return (
        <CalendrierMessagerieScreen
          initialTab={coachCalendarTab}
          openStudentId={coachMessageTarget}
          onConsumeOpenStudentId={() => setCoachMessageTarget(null)}
        />
      );
      default: return <CoachDashboardScreen />;
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
