import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { Theme } from '@/schema';
import { THEME_LABELS, THEME_EMOJIS, THEME_OG_COLORS } from '@/data/themes';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const theme = (searchParams.get('theme') || 'default') as Theme;
    const room = searchParams.get('room');

    const colors = THEME_OG_COLORS[theme] || THEME_OG_COLORS.default;
    const emoji = THEME_EMOJIS[theme] || '🕵️';
    const label = THEME_LABELS[theme] || 'Default';

    const title = room ? `Room ${room}` : `${label} Theme`;
    const subtitle = room
      ? 'Join to play Imposter Word Game!'
      : 'Play the word guessing party game';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background: `radial-gradient(circle at 20% 50%, ${colors.accent} 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, ${colors.accent} 0%, transparent 50%)`,
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            {/* Emoji */}
            <div
              style={{
                fontSize: 160,
                marginBottom: 20,
                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
              }}
            >
              {emoji}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: 16,
                textShadow: '0 4px 12px rgba(0,0,0,0.4)',
                maxWidth: '90%',
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: 36,
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                marginBottom: 32,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {subtitle}
            </div>

            {/* Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: 50,
                padding: '16px 40px',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: 'white',
                  letterSpacing: '1px',
                }}
              >
                🕵️ IMPOSTER WORD GAME
              </div>
            </div>

            {/* Domain */}
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255,255,255,0.8)',
                marginTop: 32,
                letterSpacing: '2px',
              }}
            >
              imposterga.me
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation failed:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
