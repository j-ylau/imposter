-- Theme Likes Tracking
-- Tracks individual user likes for themes (distinct from daily usage stats)

-- Create table for theme likes
CREATE TABLE IF NOT EXISTS theme_likes (
  id BIGSERIAL PRIMARY KEY,
  theme TEXT NOT NULL,
  session_id TEXT, -- Optional: track by session to prevent spam
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_theme_likes_theme ON theme_likes(theme);
CREATE INDEX IF NOT EXISTS idx_theme_likes_created_at ON theme_likes(created_at);
CREATE INDEX IF NOT EXISTS idx_theme_likes_session ON theme_likes(session_id);

-- Enable RLS
ALTER TABLE theme_likes ENABLE ROW LEVEL SECURITY;

-- Allow public to read likes
CREATE POLICY "Anyone can read theme likes"
  ON theme_likes FOR SELECT
  TO public
  USING (true);

-- Allow public to insert likes (we'll handle rate limiting in app)
CREATE POLICY "Anyone can like themes"
  ON theme_likes FOR INSERT
  TO public
  WITH CHECK (true);

-- RPC function to get most loved themes
CREATE OR REPLACE FUNCTION get_most_loved_themes(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  theme TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    theme_likes.theme,
    COUNT(*) as count
  FROM theme_likes
  GROUP BY theme_likes.theme
  ORDER BY count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- RPC function to get theme like count
CREATE OR REPLACE FUNCTION get_theme_like_count(p_theme TEXT)
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM theme_likes
    WHERE theme = p_theme
  );
END;
$$ LANGUAGE plpgsql;
