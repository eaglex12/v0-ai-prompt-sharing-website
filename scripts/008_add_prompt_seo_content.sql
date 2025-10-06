-- Add optional rich SEO content to prompts
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS seo_content TEXT; -- store HTML/Markdown authored by admins

-- No backfill required; null means not provided


