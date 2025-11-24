-- Popular Themes Today tracking table
-- Tracks daily theme usage for analytics and homepage display

CREATE TABLE IF NOT EXISTS theme_stats (
  id BIGSERIAL PRIMARY KEY,
  theme TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure one row per theme per day
  CONSTRAINT unique_theme_date UNIQUE (theme, date)
);

-- Index for fast queries
CREATE INDEX idx_theme_stats_date ON theme_stats(date DESC);
CREATE INDEX idx_theme_stats_theme_date ON theme_stats(theme, date DESC);

-- Function to increment theme count
CREATE OR REPLACE FUNCTION increment_theme_count(p_theme TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO theme_stats (theme, date, count)
  VALUES (p_theme, CURRENT_DATE, 1)
  ON CONFLICT (theme, date)
  DO UPDATE SET
    count = theme_stats.count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get popular themes for a specific date
CREATE OR REPLACE FUNCTION get_popular_themes(p_date DATE DEFAULT CURRENT_DATE, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  theme TEXT,
  count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT ts.theme, ts.count
  FROM theme_stats ts
  WHERE ts.date = p_date
  ORDER BY ts.count DESC, ts.theme ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE theme_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read theme stats (public data)
CREATE POLICY "Anyone can view theme stats"
  ON theme_stats
  FOR SELECT
  USING (true);

-- Policy: Allow service role to insert/update (server-side only)
CREATE POLICY "Service role can manage theme stats"
  ON theme_stats
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add helpful comment
COMMENT ON TABLE theme_stats IS 'Tracks daily theme usage for Popular Themes Today feature';
COMMENT ON FUNCTION increment_theme_count IS 'Atomically increments theme count for today';
COMMENT ON FUNCTION get_popular_themes IS 'Returns top N popular themes for a given date';
