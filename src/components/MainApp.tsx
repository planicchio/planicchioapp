import { useState, useEffect } from 'react';
import { User, LogIn } from 'lucide-react';
import { useApp, COURSES } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { supabase } from '@/integrations/supabase/client';
import BottomNav from './BottomNav';
import CatPet from './CatPet';
import HomeTab from './HomeTab';
import CuriositiesTab from './CuriositiesTab';
import DictionaryTab from './DictionaryTab';
import CommunityTab from './CommunityTab';
import ExercisesTab from './ExercisesTab';
import PetTab from './PetTab';
import ProfileSheet from './ProfileSheet';
import AuthScreen from './AuthScreen';

// Register extended word bank globally
import { extendedWordBank } from '@/data/wordBankExtended';
(window as any).__extendedWordBank = extendedWordBank;

const tabComponents: Record<string, React.FC> = {
  home: HomeTab,
  curiosities: CuriositiesTab,
  dictionary: DictionaryTab,
  community: CommunityTab,
  exercises: ExercisesTab,
  pet: PetTab,
};

const MainApp = () => {
  const { activeTab, course, nativeLang } = useApp();
  const tr = useTranslation(nativeLang);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const TabContent = tabComponents[activeTab] || HomeTab;
  const courseName = COURSES.find(c => c.id === course)?.flag || '🌍';

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐱</span>
          <h1 className="text-xl font-black text-primary">Planicchio</h1>
          <span className="text-lg">{courseName}</span>
        </div>
        <div className="flex items-center gap-2">
          {!user ? (
            <button onClick={() => setAuthOpen(true)}
              className="bg-primary text-primary-foreground rounded-full px-3 py-1.5 text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform">
              <LogIn size={14} /> Login
            </button>
          ) : (
            <button onClick={handleLogout}
              className="text-xs text-muted-foreground hover:text-foreground font-bold">
              {user.email?.split('@')[0]}
            </button>
          )}
          <button
            onClick={() => setProfileOpen(true)}
            className="bg-card border border-border rounded-full p-2 hover:bg-muted transition-colors"
          >
            <User size={20} className="text-foreground" />
          </button>
        </div>
      </header>

      <main className="px-4 pt-4 max-w-lg mx-auto">
        <TabContent />
      </main>

      <CatPet />
      <BottomNav />
      <ProfileSheet open={profileOpen} onClose={() => setProfileOpen(false)} />
      {authOpen && <AuthScreen onClose={() => setAuthOpen(false)} />}
    </div>
  );
};

export default MainApp;
