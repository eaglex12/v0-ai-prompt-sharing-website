-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('Text Generation', 'text-generation', 'Prompts for generating various types of text content', '#3b82f6'),
  ('Image Creation', 'image-creation', 'Prompts for AI image generation and art creation', '#8b5cf6'),
  ('Code & Development', 'code-development', 'Programming and development related prompts', '#10b981'),
  ('Creative Writing', 'creative-writing', 'Storytelling, poetry, and creative content prompts', '#f59e0b'),
  ('Business & Marketing', 'business-marketing', 'Professional and marketing content prompts', '#ef4444'),
  ('Education & Learning', 'education-learning', 'Educational content and learning prompts', '#06b6d4')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample prompts
INSERT INTO prompts (title, content, description, category_id, reference_image_url, tags, is_trending, is_featured) VALUES
  (
    'Cyberpunk Portrait Generator',
    'Create a stunning cyberpunk portrait of [SUBJECT] with neon lighting, futuristic elements, and a dark urban atmosphere. Include glowing cybernetic enhancements and vibrant color contrasts.',
    'Perfect for generating futuristic character portraits with cyberpunk aesthetics',
    (SELECT id FROM categories WHERE slug = 'image-creation'),
    '/cyberpunk-neon-portrait-futuristic.jpg',
    ARRAY['cyberpunk', 'portrait', 'neon', 'futuristic'],
    true,
    true
  ),
  (
    'Modern Interior Design',
    'Design a minimalist modern interior space with [ROOM_TYPE]. Focus on clean lines, natural lighting, neutral colors, and functional furniture. Include plants and natural materials.',
    'Generate beautiful modern interior design concepts',
    (SELECT id FROM categories WHERE slug = 'image-creation'),
    '/minimalist-3d-room-modern-furniture.jpg',
    ARRAY['interior', 'modern', 'minimalist', 'design'],
    true,
    false
  ),
  (
    'Golden Hour Photography',
    'Capture a breathtaking golden hour photograph of [SUBJECT] with warm, soft lighting. Emphasize the magical quality of the light and create a dreamy, cinematic atmosphere.',
    'Create stunning golden hour photography with perfect lighting',
    (SELECT id FROM categories WHERE slug = 'image-creation'),
    '/golden-hour-photography-warm-lighting.jpg',
    ARRAY['photography', 'golden hour', 'lighting', 'cinematic'],
    false,
    true
  ),
  (
    'Viral Social Media Content',
    'Write a viral social media post about [TOPIC] that will engage your audience. Include hooks, emotional triggers, and a clear call-to-action. Make it shareable and memorable.',
    'Create engaging social media content that drives engagement',
    (SELECT id FROM categories WHERE slug = 'business-marketing'),
    '/funny-cat-meme-expressive-face.jpg',
    ARRAY['social media', 'viral', 'engagement', 'marketing'],
    true,
    false
  ),
  (
    'Abstract Digital Art',
    'Generate an abstract digital artwork with flowing organic shapes, vibrant gradients, and dynamic composition. Use [COLOR_PALETTE] and create a sense of movement and energy.',
    'Create stunning abstract digital art with flowing patterns',
    (SELECT id FROM categories WHERE slug = 'image-creation'),
    '/abstract-digital-art-flowing-patterns.jpg',
    ARRAY['abstract', 'digital art', 'flowing', 'organic'],
    false,
    false
  ),
  (
    'Isometric Building Design',
    'Design an isometric view of a [BUILDING_TYPE] with clean architectural lines, modern materials, and detailed structural elements. Use a professional color scheme.',
    'Generate professional isometric architectural designs',
    (SELECT id FROM categories WHERE slug = 'image-creation'),
    '/isometric-building-architectural-design.jpg',
    ARRAY['isometric', 'architecture', 'building', 'design'],
    false,
    true
  );

-- Update likes and views for sample data
UPDATE prompts SET 
  likes_count = FLOOR(RANDOM() * 500 + 50),
  views_count = FLOOR(RANDOM() * 2000 + 200),
  copies_count = FLOOR(RANDOM() * 300 + 30)
WHERE id IN (SELECT id FROM prompts LIMIT 6);
