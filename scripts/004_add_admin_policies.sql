-- Add RLS policies for admin operations (UPDATE and DELETE)
-- These policies allow public access to update and delete prompts
-- In a production environment, you might want to add authentication checks

-- Allow public update access to prompts
CREATE POLICY "Allow public update access to prompts" ON prompts
  FOR UPDATE USING (true);

-- Allow public delete access to prompts  
CREATE POLICY "Allow public delete access to prompts" ON prompts
  FOR DELETE USING (true);

-- Allow public insert access to prompts (for creating new prompts)
CREATE POLICY "Allow public insert access to prompts" ON prompts
  FOR INSERT WITH CHECK (true);

-- Allow public update access to categories
CREATE POLICY "Allow public update access to categories" ON categories
  FOR UPDATE USING (true);

-- Allow public delete access to categories
CREATE POLICY "Allow public delete access to categories" ON categories
  FOR DELETE USING (true);

-- Allow public insert access to categories
CREATE POLICY "Allow public insert access to categories" ON categories
  FOR INSERT WITH CHECK (true);
