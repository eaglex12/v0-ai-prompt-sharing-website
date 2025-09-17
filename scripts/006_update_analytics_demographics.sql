-- Add demographic columns to prompt_analytics table
ALTER TABLE prompt_analytics 
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS device TEXT,
ADD COLUMN IF NOT EXISTS browser TEXT,
ADD COLUMN IF NOT EXISTS os TEXT,
ADD COLUMN IF NOT EXISTS screen_resolution TEXT,
ADD COLUMN IF NOT EXISTS language TEXT;

-- Remove likes_count column from prompts table
ALTER TABLE prompts DROP COLUMN IF EXISTS likes_count;

-- Create indexes for better performance on new demographic columns
CREATE INDEX IF NOT EXISTS idx_analytics_country ON prompt_analytics(country);
CREATE INDEX IF NOT EXISTS idx_analytics_device ON prompt_analytics(device);
CREATE INDEX IF NOT EXISTS idx_analytics_browser ON prompt_analytics(browser);
CREATE INDEX IF NOT EXISTS idx_analytics_os ON prompt_analytics(os);

-- Update action_type constraint to remove 'like' option
-- Note: This might require recreating the table in some databases
-- For now, we'll just ensure new inserts don't use 'like'
