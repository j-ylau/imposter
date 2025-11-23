# Room Cleanup Edge Function

This edge function automatically deletes inactive/expired rooms to keep the database clean and performant.

## What it does

Deletes rooms that meet ANY of these conditions:
1. **Expired** - `expires_at < now()`
2. **Empty** - No players in the room
3. **Old completed games** - Phase is 'results' and `updated_at` is older than 10 minutes

## Setup (Production)

### 1. Deploy the function

```bash
supabase functions deploy cleanup-rooms
```

### 2. Set up cron schedule via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Database** → **Cron Jobs** (or use pg_cron extension)
3. Create a new cron job:

```sql
-- Run cleanup every 10 minutes
select cron.schedule(
  'cleanup-inactive-rooms',
  '*/10 * * * *', -- Every 10 minutes
  $$
    select net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/cleanup-rooms',
      headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    );
  $$
);
```

Or use the Supabase dashboard cron UI (if available in your plan).

## Testing locally

```bash
# Test the function manually
supabase functions serve cleanup-rooms

# In another terminal, invoke it
curl -X POST http://localhost:54321/functions/v1/cleanup-rooms \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Response format

```json
{
  "success": true,
  "deleted": 5,
  "expired": 2,
  "empty": 1,
  "oldGames": 2
}
```

## Notes

- The function requires the `SUPABASE_SERVICE_ROLE_KEY` environment variable
- Make sure the function is deployed before setting up the cron job
- Monitor the function logs in the Supabase dashboard to ensure it's running correctly
