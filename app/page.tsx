'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Card, CardBody } from '@/components/UI/Card';
import { Modal } from '@/components/UI/Modal';
import { createRoom } from '@/lib/game';
import { roomApi } from '@/lib/realtime';
import { Theme } from '@/schema';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';
import { isValidPlayerName, randomItem } from '@/lib/util';
import { useTranslation } from '@/lib/i18n';

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [playerName, setPlayerName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('default');
  const [showThemes, setShowThemes] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const themes: Theme[] = ['default', 'pokemon', 'nba', 'memes', 'movies', 'countries'];

  const handleCreate = async (useRandomTheme = false) => {
    if (!isValidPlayerName(playerName)) {
      setError(t.home.errors.invalidName);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const theme = useRandomTheme ? randomItem(themes) : selectedTheme;
      const room = createRoom(playerName, theme);
      await roomApi.createRoom(room);

      localStorage.setItem('currentPlayerId', room.hostId);
      localStorage.setItem('currentPlayerName', playerName);

      router.push(`/room/${room.id}`);
    } catch (err) {
      console.error('Failed to create room:', err);
      setError(err instanceof Error ? err.message : t.home.errors.createFailed);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="text-6xl mb-4">🕵️</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {t.home.title}
            </h1>
            <p className="text-gray-600 mb-3">
              {t.home.subtitle}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setShowHowToPlay(true)}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm underline"
              >
                {t.home.howToPlay}
              </button>
              <span className="text-gray-400">•</span>
              <button
                onClick={() => router.push('/join')}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm underline"
              >
                {t.home.joinRoom}
              </button>
            </div>
          </div>

          {/* Name Input */}
          <Card variant="elevated">
            <CardBody>
              <Input
                type="text"
                placeholder={t.home.yourName}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !showThemes && handleCreate(true)}
                error={error}
                maxLength={20}
                autoFocus
              />
            </CardBody>
          </Card>

          {/* Theme Selection */}
          <Card variant="elevated">
            <CardBody className="space-y-3">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleCreate(true)}
                  disabled={loading || !playerName.trim()}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  🎲 {t.home.randomTheme}
                </Button>
                <span className="text-sm font-medium text-gray-500 px-2">or</span>
                <Button
                  onClick={() => setShowThemes(!showThemes)}
                  disabled={!playerName.trim()}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  {showThemes ? `✕ ${t.common.close}` : `🎨 ${t.home.chooseTheme}`}
                </Button>
              </div>

              {showThemes && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3 border-t">
                  {themes.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => {
                        setSelectedTheme(theme);
                        handleCreate(false);
                      }}
                      disabled={loading}
                      className="p-3 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{THEME_EMOJIS[theme]}</span>
                        <span className="font-medium text-gray-900">
                          {THEME_LABELS[theme]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* How to Play Modal */}
      <Modal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        title={t.howToPlay.title}
        className="max-w-4xl"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Instructions */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="text-3xl flex-shrink-0">1️⃣</div>
              <div>
                <h3 className="font-bold mb-1">{t.howToPlay.steps.step1.title}</h3>
                <p className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: t.howToPlay.steps.step1.description }} />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-3xl flex-shrink-0">2️⃣</div>
              <div>
                <h3 className="font-bold mb-1">{t.howToPlay.steps.step2.title}</h3>
                <p className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: t.howToPlay.steps.step2.description }} />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-3xl flex-shrink-0">3️⃣</div>
              <div>
                <h3 className="font-bold mb-1">{t.howToPlay.steps.step3.title}</h3>
                <p className="text-gray-600 text-sm">
                  {t.howToPlay.steps.step3.description}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-3xl flex-shrink-0">🎯</div>
              <div>
                <h3 className="font-bold mb-1">{t.howToPlay.steps.win.title}</h3>
                <p className="text-sm text-green-600" dangerouslySetInnerHTML={{ __html: t.howToPlay.steps.win.players }} />
                <p className="text-sm text-red-600" dangerouslySetInnerHTML={{ __html: t.howToPlay.steps.win.imposter }} />
              </div>
            </div>
          </div>

          {/* Example */}
          <div>
            <h3 className="font-bold mb-3 text-gray-900">{t.howToPlay.example.title}</h3>
            <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-4 space-y-3 text-sm h-[600px] overflow-y-auto">
              {/* Invite */}
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-2xl px-4 py-2 max-w-[80%]">
                  {t.howToPlay.example.invite}<br/>
                  <span className="text-xs opacity-90">imposter.game/ABC123</span>
                </div>
              </div>

              {/* Joins */}
              <div className="flex justify-start">
                <div className="bg-gray-300 text-gray-900 rounded-2xl px-4 py-2 max-w-[80%]">
                  <strong>Sarah</strong><br/>
                  {t.howToPlay.example.joined}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-300 text-gray-900 rounded-2xl px-4 py-2 max-w-[80%]">
                  <strong>Mike</strong><br/>
                  {t.howToPlay.example.imIn}
                </div>
              </div>

              {/* Game Start */}
              <div className="text-center">
                <span className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full">
                  {t.howToPlay.example.gameStarting}
                </span>
              </div>

              {/* Role Reveals */}
              <div className="flex justify-end">
                <div className="bg-green-500 text-white rounded-2xl px-4 py-2 max-w-[80%]">
                  <strong>{t.howToPlay.example.yourWord}</strong><br/>
                  🍕 PIZZA
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-green-500 text-white rounded-2xl px-4 py-2 max-w-[70%]">
                  <strong>Sarah&apos;s word:</strong><br/>
                  🍕 PIZZA
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-red-500 text-white rounded-2xl px-4 py-2 max-w-[70%]">
                  <strong>Mike:</strong><br/>
                  🕵️ {t.howToPlay.example.imposterRole}
                </div>
              </div>

              {/* Clue Round */}
              <div className="text-center">
                <span className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full">
                  {t.howToPlay.example.submitClues}
                </span>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-2xl px-4 py-2">
                  {t.howToPlay.example.myClue} &quot;Italian&quot;
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-300 text-gray-900 rounded-2xl px-4 py-2">
                  <strong>Sarah:</strong> &quot;Cheese&quot;
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-300 text-gray-900 rounded-2xl px-4 py-2">
                  <strong>Mike:</strong> &quot;Food&quot; 🤔
                </div>
              </div>

              {/* Discussion */}
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-2xl px-4 py-2 max-w-[80%]">
                  {t.howToPlay.example.discussion1}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-300 text-gray-900 rounded-2xl px-4 py-2">
                  <strong>Sarah:</strong> {t.howToPlay.example.discussion2}
                </div>
              </div>

              {/* Voting */}
              <div className="text-center">
                <span className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full">
                  {t.howToPlay.example.votingTime}
                </span>
              </div>

              <div className="flex justify-center">
                <div className="bg-purple-100 border border-purple-300 rounded-xl px-4 py-2 text-purple-900 text-xs">
                  You {t.howToPlay.example.votedFor} Mike<br/>
                  Sarah {t.howToPlay.example.votedFor} Mike<br/>
                  Mike {t.howToPlay.example.votedFor} You
                </div>
              </div>

              {/* Result */}
              <div className="flex justify-center">
                <div className="bg-green-500 text-white rounded-2xl px-6 py-3 font-bold text-center">
                  {t.howToPlay.example.playersWin}<br/>
                  <span className="text-sm font-normal">Mike {t.howToPlay.example.wasImposter}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t mt-6">
          <Button onClick={() => setShowHowToPlay(false)} className="w-full">
            {t.howToPlay.gotIt}
          </Button>
        </div>
      </Modal>
    </>
  );
}
