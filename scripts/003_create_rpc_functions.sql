-- Create RPC functions for incrementing counters
CREATE OR REPLACE FUNCTION increment_views_count(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts 
  SET views_count = views_count + 1 
  WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_copies_count(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts 
  SET copies_count = copies_count + 1 
  WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql;

