import { useState, useEffect } from 'react';
import { Send, Lock, MessageCircle, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

interface Comment {
  id: number;
  name: string;
  text: string;
  time: string;
  likes: number;
  replies: Comment[];
}

const COMMENTS_STORAGE_KEY = 'planicchio_community_comments';

const defaultComments: Comment[] = [
  { id: 1, name: 'Maria 🇧🇷', text: 'Alguém mais aprendendo inglês? 🙋‍♀️', time: '2h', likes: 5, replies: [
    { id: 101, name: 'João 🇧🇷', text: '👋 Eu! Estou no nível A2!', time: '1h', likes: 2, replies: [] },
    { id: 102, name: 'Ana 🇧🇷', text: 'Também! Vamos praticar juntos!', time: '45min', likes: 3, replies: [] },
  ]},
  { id: 2, name: 'João 🇧🇷', text: '💡 Planicchio é incrível! Aprendi 50 palavras essa semana!', time: '4h', likes: 12, replies: [] },
  { id: 3, name: 'Ana 🇧🇷', text: '🎉🎉 Cheguei no nível B1! Muito feliz!', time: '6h', likes: 20, replies: [
    { id: 301, name: 'Carlos 🇧🇷', text: 'Parabéns! 🎊', time: '5h', likes: 4, replies: [] },
  ] },
  { id: 4, name: 'Pedro 🇧🇷', text: 'Dica: assistam séries no idioma que estão aprendendo com legenda!', time: '8h', likes: 15, replies: [] },
  { id: 5, name: 'Luna 🇪🇸', text: '¡Hola a todos! Estoy aprendiendo portugués 🇧🇷', time: '10h', likes: 8, replies: [] },
];

const CommunityTab = () => {
  const { name, nativeLang } = useApp();
  const tr = useTranslation(nativeLang);

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem(COMMENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultComments;
  });

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set([1, 3]));

  // Persist comments
  useEffect(() => {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  const handleSend = () => {
    if (!newComment.trim()) return;
    setComments([
      { id: Date.now(), name: `${name} 🌍`, text: newComment, time: tr('now'), likes: 0, replies: [] },
      ...comments,
    ]);
    setNewComment('');
  };

  const handleReply = (commentId: number) => {
    if (!replyText.trim()) return;
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return { ...c, replies: [...c.replies, { id: Date.now(), name: `${name} 🌍`, text: replyText, time: tr('now'), likes: 0, replies: [] }] };
      }
      return c;
    }));
    setReplyText('');
    setReplyingTo(null);
    setExpandedReplies(prev => new Set(prev).add(commentId));
  };

  const handleLike = (commentId: number, isReply?: boolean, parentId?: number) => {
    if (isReply && parentId) {
      setComments(comments.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: c.replies.map(r => r.id === commentId ? { ...r, likes: r.likes + 1 } : r) };
        }
        return c;
      }));
    } else {
      setComments(comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
    }
  };

  const toggleReplies = (id: number) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center mb-2">
        <span className="text-4xl">👥</span>
        <h2 className="text-2xl font-black text-foreground">{tr('community_title')}</h2>
        <p className="text-xs text-muted-foreground">{tr('community_desc') || 'Compartilhe, responda e interaja com outros estudantes!'}</p>
      </div>

      {/* Post area */}
      <div className="bg-card rounded-xl p-3 border border-border">
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder={tr('share_something')}
          rows={2}
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground font-semibold focus:outline-none resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSend}
            disabled={!newComment.trim()}
            className="bg-primary text-primary-foreground rounded-xl px-4 py-2 font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
          >
            <Send size={14} className="inline mr-1" />
            {tr('post') || 'Publicar'}
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-3">
        {comments.map(c => (
          <div key={c.id} className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-foreground">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.time}</span>
            </div>
            <p className="text-sm text-foreground mb-2">{c.text}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => handleLike(c.id)} className="text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1 transition-colors">
                <Heart size={12} className={c.likes > 0 ? 'fill-red-500 text-red-500' : ''} /> {c.likes}
              </button>
              <button
                onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyText(''); }}
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                <MessageCircle size={12} /> {tr('reply')}
              </button>
              {c.replies.length > 0 && (
                <button onClick={() => toggleReplies(c.id)} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                  {expandedReplies.has(c.id) ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {c.replies.length} {tr('reply')}
                </button>
              )}
            </div>

            {/* Reply input */}
            {replyingTo === c.id && (
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReply(c.id)}
                  placeholder={`${tr('reply')}...`}
                  className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button onClick={() => handleReply(c.id)} className="bg-primary text-primary-foreground rounded-lg px-3 hover:opacity-90 active:scale-95 transition-all">
                  <Send size={14} />
                </button>
              </div>
            )}

            {/* Replies */}
            {expandedReplies.has(c.id) && c.replies.length > 0 && (
              <div className="ml-4 mt-3 space-y-2 border-l-2 border-primary/20 pl-3">
                {c.replies.map(r => (
                  <div key={r.id} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-foreground">{r.name}</span>
                      <span className="text-[10px] text-muted-foreground">{r.time}</span>
                    </div>
                    <p className="text-xs text-foreground">{r.text}</p>
                    <button onClick={() => handleLike(r.id, true, c.id)} className="text-[10px] text-muted-foreground hover:text-red-500 flex items-center gap-1 mt-1 transition-colors">
                      <Heart size={10} className={r.likes > 0 ? 'fill-red-500 text-red-500' : ''} /> {r.likes}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* VIP Features */}
      <div className="space-y-3">
        {[
          { title: tr('talk_natives'), desc: tr('talk_natives_desc') },
          { title: tr('ai_assistant'), desc: tr('ai_assistant_desc') },
          { title: tr('language_reactor'), desc: tr('language_reactor_desc') },
        ].map((feature, i) => (
          <div key={i} className="bg-card rounded-2xl p-4 border-2 border-dashed border-primary/30 flex items-center gap-3">
            <Lock className="text-primary/50 flex-shrink-0" size={20} />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-foreground">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
            <a
              href="https://buy.stripe.com/9B614o1gU3dXeHq7UeaMU01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
            >
              VIP
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityTab;
