-- Fix slug generation to preserve first letter
-- This script updates the generate_prompt_slug function to properly handle slug generation
-- without losing the first character of the title

CREATE OR REPLACE FUNCTION generate_prompt_slug(p_title TEXT, p_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  unique_slug TEXT;
BEGIN
  -- First convert to lowercase and trim whitespace
  base_slug := lower(trim(coalesce(p_title, '')));
  -- Replace spaces and special characters with hyphens, but preserve alphanumeric chars
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  -- Remove leading and trailing hyphens
  base_slug := trim(both '-' FROM base_slug);
  -- Remove multiple consecutive hyphens
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  
  -- If the slug is empty after processing, use default
  IF base_slug IS NULL OR base_slug = '' THEN
    base_slug := 'prompt';
  END IF;
  
  -- Append short hash of id to keep uniqueness without exposing UUID directly
  unique_slug := base_slug || '-' || substring(md5(p_id::text) from 1 for 6);
  RETURN unique_slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing prompts with corrected slugs
-- This will regenerate slugs for all existing prompts using the fixed function
UPDATE prompts p
SET slug = generate_prompt_slug(p.title, p.id)
WHERE slug IS NOT NULL AND slug != '';

-- Add comment explaining the fix
COMMENT ON FUNCTION generate_prompt_slug(TEXT, UUID) IS 
'Generates SEO-friendly slugs from prompt titles. Fixed to preserve first character and handle edge cases properly.';
