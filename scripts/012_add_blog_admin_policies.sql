-- Add RLS policies for blog admin operations (UPDATE, INSERT, and DELETE)
-- These policies allow public access to update, insert, and delete blog posts
-- In a production environment, you might want to add authentication checks

-- Allow public update access to blog posts
CREATE POLICY "Allow public update access to blog posts" ON blog_posts
  FOR UPDATE USING (true);

-- Allow public delete access to blog posts  
CREATE POLICY "Allow public delete access to blog posts" ON blog_posts
  FOR DELETE USING (true);

-- Allow public insert access to blog posts (for creating new posts)
CREATE POLICY "Allow public insert access to blog posts" ON blog_posts
  FOR INSERT WITH CHECK (true);

-- Allow public update access to blog categories
CREATE POLICY "Allow public update access to blog categories" ON blog_categories
  FOR UPDATE USING (true);

-- Allow public delete access to blog categories
CREATE POLICY "Allow public delete access to blog categories" ON blog_categories
  FOR DELETE USING (true);

-- Allow public insert access to blog categories
CREATE POLICY "Allow public insert access to blog categories" ON blog_categories
  FOR INSERT WITH CHECK (true);
