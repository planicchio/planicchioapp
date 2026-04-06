
-- User profiles table for social features
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL DEFAULT 'Estudante',
  bio TEXT DEFAULT '',
  country TEXT DEFAULT '',
  interests TEXT[] DEFAULT '{}',
  avatar_emoji TEXT DEFAULT '🌍',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON public.user_profiles FOR SELECT TO public USING (true);
CREATE POLICY "Users can create own profile" ON public.user_profiles FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE TO public USING (auth.uid() = user_id);

-- Allow likes to be deleted (for unlike)
CREATE POLICY "Users can delete own likes" ON public.community_likes FOR DELETE TO public USING (auth.uid() = user_id);

-- Allow posts to be updated (for like count)
CREATE POLICY "Anyone can update post likes" ON public.community_posts FOR UPDATE TO public USING (true);

-- Allow replies to be updated (for like count)
CREATE POLICY "Anyone can update reply likes" ON public.community_replies FOR UPDATE TO public USING (true);

-- Add repost support to posts
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS repost_of UUID REFERENCES public.community_posts(id) ON DELETE SET NULL;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS reposts_count INTEGER NOT NULL DEFAULT 0;

-- Trigger for updated_at on profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
