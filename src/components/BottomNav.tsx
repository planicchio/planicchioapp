import { Home, Lightbulb, BookOpen, Users, PenTool, type LucideIcon } from 'lucide-react';
import { useApp, type TabId } from '@/contexts/AppContext';

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'curiosities', label: 'Dicas', icon: Lightbulb },
  { id: 'dictionary', label: 'Dicionário', icon: BookOpen },
  { id: 'community', label: 'Social', icon: Users },
  { id: 'exercises', label: 'Exercícios', icon: PenTool },
];

const BottomNav = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                active ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={22} className={active ? 'drop-shadow-sm' : ''} />
              <span className={`text-[10px] font-bold ${active ? '' : 'font-semibold'}`}>{label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
