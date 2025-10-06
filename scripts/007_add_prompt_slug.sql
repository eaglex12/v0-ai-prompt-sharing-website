-- Add slug column to prompts for SEO-friendly URLs
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create a generated/default slug based on title; ensure uniqueness via hash suffix when needed
CREATE OR REPLACE FUNCTION generate_prompt_slug(p_title TEXT, p_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  unique_slug TEXT;
BEGIN
  base_slug := lower(regexp_replace(coalesce(p_title, ''), '[^a-z0-9]+', '-', 'g'));
  base_slug := trim(both '-' FROM base_slug);
  IF base_slug IS NULL OR base_slug = '' THEN
    base_slug := 'prompt';
  END IF;
  -- Append short hash of id to keep uniqueness without exposing UUID directly
  unique_slug := base_slug || '-' || substring(md5(p_id::text) from 1 for 6);
  RETURN unique_slug;
END;
$$ LANGUAGE plpgsql;

-- Backfill existing rows
UPDATE prompts p
SET slug = generate_prompt_slug(p.title, p.id)
WHERE slug IS NULL OR slug = '';

-- Add unique index for slugs
CREATE UNIQUE INDEX IF NOT EXISTS idx_prompts_slug_unique ON prompts(slug);

-- Trigger to maintain slug on insert/update when title changes
CREATE OR REPLACE FUNCTION ensure_prompt_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' OR NEW.title IS DISTINCT FROM OLD.title THEN
    NEW.slug := generate_prompt_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prompts_slug ON prompts;
CREATE TRIGGER trg_prompts_slug
BEFORE INSERT OR UPDATE ON prompts
FOR EACH ROW
EXECUTE FUNCTION ensure_prompt_slug();


