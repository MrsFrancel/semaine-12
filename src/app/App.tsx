import { useState } from 'react';
import { LoginScreen } from './screens/LoginScreen';
import { OnboardingScreen } from './screens/student/OnboardingScreen';
import { StudentSpace } from './screens/student/StudentSpace';
import { SchoolSpace } from './screens/school/SchoolSpace';

type Space = 'login' | 'student-onboarding' | 'student' | 'admin' | 'coach';

export default function App() {
  const [space, setSpace] = useState<Space>('login');

  if (space === 'login') return <LoginScreen onPick={setSpace} />;
  if (space === 'student-onboarding') return <OnboardingScreen onDone={() => setSpace('student')} />;
  if (space === 'student') return <StudentSpace onExit={() => setSpace('login')} />;
  return <SchoolSpace role={space} onExit={() => setSpace('login')} />;
}
