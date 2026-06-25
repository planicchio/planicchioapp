-- Fix RLS policies for authenticated user operations

-- Drop old policies that need to be replaced (if they exist)
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.community_posts;
DROP POLICY IF EXISTS "Authenticated users can create replies" ON public.community_replies;

-- Create new policies with proper authentication checks
CREATE POLICY "Authenticated users can create posts" ON public.community_posts 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create replies" ON public.community_replies 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- Fix follows policies for authenticated users
DROP POLICY IF EXISTS "Anyone can create follows" ON public.community_follows;
DROP POLICY IF EXISTS "Anyone can delete follows" ON public.community_follows;

CREATE POLICY "Authenticated users can create follows" ON public.community_follows 
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete follows" ON public.community_follows 
  FOR DELETE TO authenticated USING (follower_id = auth.uid()::text);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
