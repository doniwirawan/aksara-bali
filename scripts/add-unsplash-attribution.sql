-- Add Unsplash attribution columns to blog_posts
-- Run this in the Supabase SQL editor
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_credit TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_credit_url TEXT;
