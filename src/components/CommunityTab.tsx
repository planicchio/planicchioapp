import { useState } from 'react';
import { Send, Lock, MessageCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const initialComments = [
  { id: 1, name: 'Maria 🇧🇷', text: 'Alguém quer praticar inglês comigo? 🙋‍♀️', time: '2h', likes: 5 },
  { id: 2, name: 'João 🇧🇷', text: 'Dica: assistam Friends com legenda em inglês, é mto bom!', time: '4h', likes: 12 },
  { id: 3, name: 'Ana 🇧🇷', text: 'Acabei de chegar no nível B1! 🎉🎉', time: '6h', likes: 20 },
  { id: 4, name: 'Pedro 🇧🇷', text: 'Japonês é difícil mas o app ajuda demais 🇯🇵', time: '1d', likes: 8 },
];

const CommunityTab = () => {
  const { name } = useApp();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleSend = () => {
    if (!newComment.trim()) return;
    setComments([
      { id: Date.now(), name: `${name} 🇧🇷`, text: newComment, time: 'agora', likes: 0 },
      ...comments,
    ]);
    setNewComment('');
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center mb-2">
        <span className="text-4xl">👥</span>
        <h2 className="text-2xl font-black text-foreground">Comunidade</h2>
      </div>

      {/* Comment input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Compartilhe algo... 💬"
          className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button onClick={handleSend} className="bg-primary text-primary-foreground rounded-xl px-4 hover:opacity-90 active:scale-95 transition-all">
          <Send size={18} />
        </button>
      </div>

      {/* Forum */}
      <div className="space-y-3">
        {comments.map(c => (
          <div key={c.id} className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-foreground">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.time}</span>
            </div>
            <p className="text-sm text-foreground">{c.text}</p>
            <div className="flex items-center gap-3 mt-2">
              <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                ❤️ {c.likes}
              </button>
              <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                <MessageCircle size={12} /> Responder
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIP features */}
      <div className="space-y-3">
        {[
          { title: 'Falar com Nativos 🗣️', desc: 'Converse com falantes nativos em tempo real' },
          { title: 'Assistente IA 🤖', desc: 'IA para corrigir textos e tirar dúvidas' },
          { title: 'Language Reactor 🎬', desc: 'Assista vídeos com tradução simultânea' },
        ].map((feature, i) => (
          <div key={i} className="bg-card rounded-2xl p-4 border-2 border-dashed border-primary/30 flex items-center gap-3">
            <Lock className="text-primary/50 flex-shrink-0" size={20} />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-foreground">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">VIP</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityTab;
