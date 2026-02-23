import { useState } from 'react';
import { X, Moon, Sun, Bell, BookOpen, RefreshCw, User, Heart, ChevronRight } from 'lucide-react';
import { useApp, PETS, COURSES } from '@/contexts/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ProfileSheet = ({ open, onClose }: Props) => {
  const {
    name, setName, pet, setPet, darkMode, setDarkMode,
    diary, setDiary, course, setCourse, setStage, level, xp, getTitle, getPetEmoji
  } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [showDiary, setShowDiary] = useState(false);
  const [showPets, setShowPets] = useState(false);
  const [showCourse, setShowCourse] = useState(false);
  const title = getTitle();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-background h-full overflow-y-auto shadow-2xl animate-[slideInRight_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slide-in-right 0.3s ease-out' }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground">Perfil</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Avatar */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-2">{getPetEmoji()}</div>
            <h3 className="font-black text-foreground text-xl">{name}</h3>
            <p className="text-sm text-muted-foreground">{title.emoji} {title.title} · {xp} XP · Nível {level}</p>
          </div>

          {/* Settings */}
          <div className="space-y-2">
            {/* Name */}
            <button
              onClick={() => { setEditingName(true); setTempName(name); }}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User size={18} className="text-primary" />
                <span className="font-bold text-foreground">Mudar nome</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            {editingName && (
              <div className="bg-card rounded-xl p-4 border border-border space-y-2">
                <input
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  className="w-full bg-muted rounded-lg px-3 py-2 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2">
                  <button onClick={() => { setName(tempName); setEditingName(false); }} className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg text-sm flex-1">Salvar</button>
                  <button onClick={() => setEditingName(false)} className="bg-muted text-foreground font-bold px-4 py-2 rounded-lg text-sm">Cancelar</button>
                </div>
              </div>
            )}

            {/* Pet */}
            <button
              onClick={() => setShowPets(!showPets)}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart size={18} className="text-primary" />
                <span className="font-bold text-foreground">Mudar pet</span>
              </div>
              <span className="text-xl">{getPetEmoji()}</span>
            </button>
            {showPets && (
              <div className="bg-card rounded-xl p-4 border border-border flex gap-3 justify-center">
                {PETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setPet(p.id); setShowPets(false); }}
                    className={`text-3xl p-2 rounded-xl transition-all ${pet === p.id ? 'bg-primary/20 scale-110' : 'hover:bg-muted'}`}
                  >
                    {p.emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
                <span className="font-bold text-foreground">Modo escuro</span>
              </div>
              <div className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${darkMode ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-5 h-5 rounded-full bg-card shadow transition-transform ${darkMode ? 'translate-x-5' : ''}`} />
              </div>
            </button>

            {/* Notifications */}
            <div className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-primary" />
                <span className="font-bold text-foreground">Notificações</span>
              </div>
              <span className="text-xs text-muted-foreground">Em breve</span>
            </div>

            {/* Diary */}
            <button
              onClick={() => setShowDiary(!showDiary)}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-primary" />
                <span className="font-bold text-foreground">Diário de estudos</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            {showDiary && (
              <div className="bg-card rounded-xl p-4 border border-border">
                <textarea
                  value={diary}
                  onChange={e => setDiary(e.target.value)}
                  placeholder="Anote seus aprendizados aqui... 📝"
                  rows={5}
                  className="w-full bg-muted rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            )}

            {/* Change course */}
            <button
              onClick={() => setShowCourse(!showCourse)}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <RefreshCw size={18} className="text-primary" />
                <span className="font-bold text-foreground">Mudar curso</span>
              </div>
              <span className="text-sm text-muted-foreground">{COURSES.find(c => c.id === course)?.flag}</span>
            </button>
            {showCourse && (
              <div className="bg-card rounded-xl p-4 border border-border grid grid-cols-3 gap-2">
                {COURSES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setCourse(c.id); setShowCourse(false); }}
                    className={`p-3 rounded-xl text-center transition-all ${course === c.id ? 'bg-primary/20' : 'hover:bg-muted'}`}
                  >
                    <span className="text-2xl block">{c.flag}</span>
                    <span className="text-xs font-bold text-foreground">{c.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Backup */}
            <button className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <RefreshCw size={18} className="text-primary" />
                <span className="font-bold text-foreground">Fazer backup</span>
              </div>
              <span className="text-xs text-muted-foreground">Em breve</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSheet;
