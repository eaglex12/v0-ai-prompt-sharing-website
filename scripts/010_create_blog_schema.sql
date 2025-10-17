-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_name TEXT DEFAULT 'AI Prompts Hub',
  author_email TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[] DEFAULT '{}',
  reading_time INTEGER DEFAULT 5, -- in minutes
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add blog_category_id to blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS blog_category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL;

-- Create blog analytics table for tracking interactions
CREATE TABLE IF NOT EXISTS blog_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'view', 'like', 'share'
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  device TEXT,
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  language TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = TRUE AND status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(blog_category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_post_id ON blog_analytics(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_created_at ON blog_analytics(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to published blog posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read access to blog categories" ON blog_categories
  FOR SELECT USING (true);

-- Analytics can be inserted by anyone (for tracking) but not read publicly
CREATE POLICY "Allow public insert to blog analytics" ON blog_analytics
  FOR INSERT WITH CHECK (true);

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION generate_blog_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at timestamp for blog posts
CREATE OR REPLACE FUNCTION update_blog_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for blog posts updated_at
CREATE TRIGGER update_blog_posts_updated_at 
  BEFORE UPDATE ON blog_posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_blog_updated_at_column();

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
  ('AI & Technology', 'ai-technology', 'Latest trends and insights in AI technology', '#3b82f6'),
  ('Prompt Engineering', 'prompt-engineering', 'Tips and techniques for effective prompt engineering', '#8b5cf6'),
  ('Tutorials', 'tutorials', 'Step-by-step guides and tutorials', '#10b981'),
  ('Industry News', 'industry-news', 'Latest news and updates from the AI industry', '#f59e0b'),
  ('Case Studies', 'case-studies', 'Real-world examples and success stories', '#ef4444')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, status, is_featured, meta_title, meta_description, tags, blog_category_id, published_at) VALUES
  (
    'The Complete Guide to AI Prompt Engineering',
    'complete-guide-ai-prompt-engineering',
    '<h1>Introduction to AI Prompt Engineering</h1><p>Prompt engineering is the art and science of crafting effective instructions for AI models...</p><h2>Key Principles</h2><p>1. Be specific and clear<br>2. Provide context<br>3. Use examples<br>4. Iterate and refine</p><h2>Advanced Techniques</h2><p>Learn about few-shot learning, chain-of-thought prompting, and more...</p>',
    'Master the art of crafting effective AI prompts with our comprehensive guide covering techniques, best practices, and real-world examples.',
    'published',
    true,
    'Complete Guide to AI Prompt Engineering | AI Prompts Hub',
    'Learn AI prompt engineering techniques, best practices, and advanced strategies. Comprehensive guide with examples and tips.',
    ARRAY['ai', 'prompt-engineering', 'tutorial', 'guide'],
    (SELECT id FROM blog_categories WHERE slug = 'prompt-engineering'),
    NOW() - INTERVAL '2 days'
  ),
  (
    '10 ChatGPT Prompts That Will Transform Your Workflow',
    '10-chatgpt-prompts-transform-workflow',
    '<h1>Boost Your Productivity with These ChatGPT Prompts</h1><p>Discover powerful prompts that can revolutionize how you work...</p><h2>Writing & Content Creation</h2><p>1. Blog post outline generator<br>2. Email template creator<br>3. Social media content planner</p><h2>Analysis & Research</h2><p>4. Data analysis assistant<br>5. Market research summarizer<br>6. Competitor analysis tool</p>',
    'Discover 10 powerful ChatGPT prompts that can revolutionize your workflow and boost productivity across different tasks.',
    'published',
    true,
    '10 ChatGPT Prompts That Will Transform Your Workflow',
    'Boost productivity with these 10 powerful ChatGPT prompts for writing, analysis, coding, and more. Transform your workflow today.',
    ARRAY['chatgpt', 'productivity', 'workflow', 'tips'],
    (SELECT id FROM blog_categories WHERE slug = 'tutorials'),
    NOW() - INTERVAL '5 days'
  ),
  (
    'The Future of AI: Trends to Watch in 2024',
    'future-ai-trends-2024',
    '<h1>AI Trends Shaping 2024</h1><p>The artificial intelligence landscape continues to evolve rapidly...</p><h2>Key Trends</h2><p>1. Multimodal AI models<br>2. Edge AI computing<br>3. AI democratization<br>4. Ethical AI development</p><h2>Industry Impact</h2><p>How these trends will affect various industries...</p>',
    'Explore the major AI trends and developments expected to shape the industry in 2024, from multimodal models to ethical AI.',
    'published',
    false,
    'The Future of AI: Trends to Watch in 2024',
    'Discover the key AI trends and developments shaping 2024. From multimodal models to ethical AI, explore what''s next.',
    ARRAY['ai-trends', '2024', 'future', 'technology'],
    (SELECT id FROM blog_categories WHERE slug = 'ai-technology'),
    NOW() - INTERVAL '1 week'
  )
ON CONFLICT (slug) DO NOTHING;
