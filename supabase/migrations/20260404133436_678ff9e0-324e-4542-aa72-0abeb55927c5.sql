
-- Create community posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- Create community replies table
CREATE TABLE public.community_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view replies" ON public.community_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.community_replies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete own replies" ON public.community_replies FOR DELETE USING (auth.uid() = user_id);

-- Create community likes table
CREATE TABLE public.community_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.community_replies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id),
  UNIQUE(reply_id, user_id)
);

ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON public.community_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can create likes" ON public.community_likes FOR INSERT WITH CHECK (true);

-- Create community follows table
CREATE TABLE public.community_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id TEXT NOT NULL,
  following_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_name)
);

ALTER TABLE public.community_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows" ON public.community_follows FOR SELECT USING (true);
CREATE POLICY "Anyone can create follows" ON public.community_follows FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete follows" ON public.community_follows FOR DELETE USING (true);

-- Create weekly ranking table
CREATE TABLE public.community_ranking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  week TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_name, week)
);

ALTER TABLE public.community_ranking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ranking" ON public.community_ranking FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ranking" ON public.community_ranking FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update ranking" ON public.community_ranking FOR UPDATE USING (true);

-- Seed some default posts for the community
INSERT INTO public.community_posts (user_name, text, likes_count) VALUES
('Maria 🇧🇷', 'Alguém mais aprendendo inglês? 🙋‍♀️', 5),
('João 🇧🇷', '💡 Planicchio é incrível! Aprendi 50 palavras essa semana!', 12),
('Ana 🇧🇷', '🎉🎉 Cheguei no nível B1! Muito feliz!', 20),
('Pedro 🇧🇷', 'Dica: assistam séries no idioma que estão aprendendo com legenda!', 15),
('Luna 🇪🇸', '¡Hola a todos! Estoy aprendiendo portugués 🇧🇷', 8),
('Yuki 🇯🇵', 'みんな頑張って！I love learning with Planicchio! 🌸', 10),
('Sophie 🇫🇷', 'J''adore cette app! Quelqu''un veut pratiquer le français? 🇫🇷', 7);

-- Seed some replies
INSERT INTO public.community_replies (post_id, user_name, text, likes_count)
SELECT id, 'João 🇧🇷', '👋 Eu! Estou no nível A2!', 2 FROM public.community_posts WHERE user_name = 'Maria 🇧🇷' LIMIT 1;

INSERT INTO public.community_replies (post_id, user_name, text, likes_count)
SELECT id, 'Ana 🇧🇷', 'Também! Vamos praticar juntos!', 3 FROM public.community_posts WHERE user_name = 'Maria 🇧🇷' LIMIT 1;

INSERT INTO public.community_replies (post_id, user_name, text, likes_count)
SELECT id, 'Carlos 🇧🇷', 'Parabéns! 🎊', 4 FROM public.community_posts WHERE user_name = 'Ana 🇧🇷' LIMIT 1;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_ranking_updated_at
BEFORE UPDATE ON public.community_ranking
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
