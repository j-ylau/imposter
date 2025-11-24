import { NextRequest } from 'next/server';
import { snapshotRankings } from '@/lib/trending';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Hourly cron endpoint to snapshot theme rankings
 *
 * This endpoint should be called every hour to track ranking changes
 * for trending detection.
 *
 * Authentication:
 * - Requires Authorization header with Bearer token
 * - Token must match CRON_SECRET environment variable
 *
 * Usage:
 * - Set up Vercel Cron, GitHub Actions, or external cron service
 * - Call: GET /api/snapshot-rankings
 * - Header: Authorization: Bearer YOUR_CRON_SECRET
 */
export async function GET(request: NextRequest) {
  // Check authentication
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.CRON_SECRET;

  // Require CRON_SECRET to be set
  if (!expectedToken) {
    return Response.json(
      { error: 'CRON_SECRET not configured' },
      { status: 500 }
    );
  }

  // Verify bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      { error: 'Missing or invalid Authorization header' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  if (token !== expectedToken) {
    return Response.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  // Execute ranking snapshot
  try {
    await snapshotRankings();

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Rankings snapshot created successfully'
    });
  } catch (error) {
    console.error('[snapshot-rankings] Error:', error);

    return Response.json(
      {
        error: 'Failed to create rankings snapshot',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
