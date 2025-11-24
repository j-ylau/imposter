-- Trending System for Popular Themes
-- Tracks ranking history to detect themes that are gaining popularity quickly

-- Create table for ranking snapshots
CREATE TABLE IF NOT EXISTS theme_ranking_history (
  id BIGSERIAL PRIMARY KEY,
  theme TEXT NOT NULL,
  rank INTEGER NOT NULL,
  play_count INTEGER NOT NULL,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  snapshot_hour INTEGER NOT NULL DEFAULT EXTRACT(HOUR FROM NOW()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_theme_snapshot UNIQUE (theme, snapshot_date, snapshot_hour)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_ranking_history_theme ON theme_ranking_history(theme);
CREATE INDEX IF NOT EXISTS idx_ranking_history_snapshot ON theme_ranking_history(snapshot_date, snapshot_hour);

-- Enable RLS
ALTER TABLE theme_ranking_history ENABLE ROW LEVEL SECURITY;

-- Allow public to read ranking history
CREATE POLICY "Anyone can read ranking history"
  ON theme_ranking_history FOR SELECT
  TO public
  USING (true);

-- Only service role can insert ranking snapshots
CREATE POLICY "Service role can insert ranking snapshots"
  ON theme_ranking_history FOR INSERT
  TO service_role
  WITH CHECK (true);

-- RPC function to snapshot current rankings
CREATE OR REPLACE FUNCTION snapshot_theme_rankings()
RETURNS void AS $$
DECLARE
  theme_record RECORD;
  current_rank INTEGER := 1;
BEGIN
  -- Get current rankings from theme_stats for today
  FOR theme_record IN
    SELECT theme, count
    FROM theme_stats
    WHERE date = CURRENT_DATE
    ORDER BY count DESC
  LOOP
    INSERT INTO theme_ranking_history (theme, rank, play_count)
    VALUES (theme_record.theme, current_rank, theme_record.count)
    ON CONFLICT (theme, snapshot_date, snapshot_hour)
    DO UPDATE SET
      rank = EXCLUDED.rank,
      play_count = EXCLUDED.play_count;

    current_rank := current_rank + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function to get trending themes
-- A theme is "trending" if it improved its rank by 3+ positions in the last 6 hours
CREATE OR REPLACE FUNCTION get_trending_themes(p_min_rank_improvement INTEGER DEFAULT 3)
RETURNS TABLE (
  theme TEXT,
  current_rank INTEGER,
  previous_rank INTEGER,
  rank_change INTEGER,
  is_trending BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH current_rankings AS (
    SELECT
      trh.theme,
      trh.rank as current_rank
    FROM theme_ranking_history trh
    WHERE trh.snapshot_date = CURRENT_DATE
      AND trh.snapshot_hour = EXTRACT(HOUR FROM NOW())
  ),
  previous_rankings AS (
    SELECT
      trh.theme,
      trh.rank as previous_rank
    FROM theme_ranking_history trh
    WHERE
      (trh.snapshot_date = CURRENT_DATE AND trh.snapshot_hour = EXTRACT(HOUR FROM NOW()) - 6)
      OR (trh.snapshot_date = CURRENT_DATE - 1 AND trh.snapshot_hour = EXTRACT(HOUR FROM NOW()) + 18)
  )
  SELECT
    cr.theme,
    cr.current_rank::INTEGER,
    COALESCE(pr.previous_rank, 999)::INTEGER as previous_rank,
    (COALESCE(pr.previous_rank, 999) - cr.current_rank)::INTEGER as rank_change,
    (COALESCE(pr.previous_rank, 999) - cr.current_rank >= p_min_rank_improvement) as is_trending
  FROM current_rankings cr
  LEFT JOIN previous_rankings pr ON cr.theme = pr.theme
  WHERE COALESCE(pr.previous_rank, 999) - cr.current_rank >= p_min_rank_improvement
  ORDER BY rank_change DESC;
END;
$$ LANGUAGE plpgsql;
