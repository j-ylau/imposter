'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Card, CardBody } from '@/components/UI/Card';
import { Modal } from '@/components/UI/Modal';
import { createRoom, addPlayer, startGame } from '@/lib/game';
import { roomApi } from '@/lib/realtime';
import { Theme, GameMode } from '@/schema';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';
import { isValidPlayerName, randomItem } from '@/lib/util';
import { useTranslation } from '@/lib/i18n';
import { PageTransition } from '@/components/Animations/PageTransition';
import { toast } from 'react-toastify';
import { handleError, getErrorTranslationKey } from '@/lib/error';
import { trackThemeUsage } from '@/lib/theme-stats';
import { PopularThemes } from '@/components/Home/PopularThemes';
import { likeTheme, hasUserLikedTheme } from '@/lib/theme-likes';
import { MostLovedThemes } from '@/components/Home/MostLovedThemes';

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [playerName, setPlayerName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('default');
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>(GameMode.Online);
  const [playerCount, setPlayerCount] = useState(4); // For pass-and-play
  const [customPlayerCount, setCustomPlayerCount] = useState('');
  const [showCustomCount, setShowCustomCount] = useState(false);
  const [showGameModes, setShowGameModes] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [likedThemes, setLikedThemes] = useState<Set<Theme>>(new Set());

  const themes: Theme[] = [
    'default',
    'pokemon',
    'nba',
    'memes',
    'movies',
    'countries',
    'anime',
    'video-games',
    'youtube',
    'tiktok',
    'music',
    'tv-shows',
    'food',
    'brands',
    'sports',
    'clash-royale',
    'minecraft',
    'animals',
    'companies',
  ];

  const quickPlayerCounts = [3, 4, 5, 6, 7, 8, 10, 12];

  const handleCustomCountSubmit = () => {
    const count = parseInt(customPlayerCount, 10);
    if (count >= 3) {
      setPlayerCount(count);
      setShowCustomCount(false);
      setCustomPlayerCount('');
    } else {
      toast.error(t.home.gameMode.passAndPlay.customCount.minError);
    }
  };

  const handleLikeTheme = async (theme: Theme, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent theme selection when clicking like button

    if (hasUserLikedTheme(theme)) {
      toast.info('You already liked this theme!');
      return;
    }

    const result = await likeTheme(theme);
    if (result.success) {
      setLikedThemes(prev => new Set(prev).add(theme));
      toast.success('❤️ Theme liked!');
    } else if (result.alreadyLiked) {
      toast.info('You already liked this theme!');
    }
  };

  const handleCreate = async (useRandomTheme = false): Promise<void> => {
    // For pass-and-play, we don't need a name since players are auto-named
    if (selectedGameMode === GameMode.Online && !isValidPlayerName(playerName)) {
      toast.error(t.home.errors.invalidName);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const theme = useRandomTheme ? randomItem(themes) : selectedTheme;

      // For pass-and-play: Create room with auto-named players
      if (selectedGameMode === GameMode.PassAndPlay) {
        // Create room with Player 1 as host
        let room = createRoom('Player 1', theme, selectedGameMode);

        // Add remaining players (Player 2, Player 3, etc.)
        for (let i = 2; i <= playerCount; i++) {
          room = addPlayer(room, `Player ${i}`);
        }

        // Auto-start the game
        room = startGame(room);

        await roomApi.createRoom(room);

        // Track theme usage for popular themes
        trackThemeUsage(theme);

        // Don't need to store player ID for pass-and-play
        toast.success(t.home.success.roomCreated);
        router.push(`/room/${room.id}`);
      } else {
        // Online mode: Use entered player name
        const room = createRoom(playerName, theme, selectedGameMode);
        await roomApi.createRoom(room);

        // Track theme usage for popular themes
        trackThemeUsage(theme);

        localStorage.setItem('currentPlayerId', room.hostId);
        localStorage.setItem('currentPlayerName', playerName);

        toast.success(t.home.success.roomCreated);
        router.push(`/room/${room.id}`);
      }
    } catch (err) {
      const appError = handleError(err);
      const errorKey = getErrorTranslationKey(appError.code);
      toast.error(t.errors[errorKey]);
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce-subtle">🕵️</div>
            <h1 className="text-4xl md:text-5xl font-bold text-fg mb-2 transition-colors">
              {t.home.title}
            </h1>
            <p className="text-fg-muted mb-3 transition-colors">
              {t.home.subtitle}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setShowHowToPlay(true)}
                className="text-primary hover:text-primary-hover font-medium text-sm underline transition-colors"
              >
                {t.home.howToPlay}
              </button>
              <span className="text-fg-subtle">•</span>
              <button
                onClick={() => router.push('/join')}
                className="text-primary hover:text-primary-hover font-medium text-sm underline transition-colors"
              >
                {t.home.joinRoom}
              </button>
            </div>
          </div>

          {/* Name Input - Only for online mode */}
          {selectedGameMode === GameMode.Online && (
            <Card variant="elevated">
              <CardBody>
                <Input
                  type="text"
                  placeholder={t.home.yourName}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !showGameModes && !showThemes && handleCreate(true)}
                  error={error}
                  maxLength={20}
                  autoFocus
                />
              </CardBody>
            </Card>
          )}

          {/* Game Mode Selection */}
          <Card variant="elevated">
            <CardBody className="space-y-3">
              <h3 className="text-lg font-bold text-fg text-center">{t.home.gameMode.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedGameMode(GameMode.Online)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedGameMode === GameMode.Online
                      ? 'border-primary bg-primary-subtle'
                      : 'border-border hover:border-primary hover:bg-primary-subtle'
                  }`}
                >
                  <div className="text-3xl mb-2">🌐</div>
                  <div className="font-bold text-fg mb-1">{t.home.gameMode.online.title}</div>
                  <div className="text-sm text-fg-muted">{t.home.gameMode.online.description}</div>
                </button>
                <button
                  onClick={() => setSelectedGameMode(GameMode.PassAndPlay)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedGameMode === GameMode.PassAndPlay
                      ? 'border-primary bg-primary-subtle'
                      : 'border-border hover:border-primary hover:bg-primary-subtle'
                  }`}
                >
                  <div className="text-3xl mb-2">📱</div>
                  <div className="font-bold text-fg mb-1">{t.home.gameMode.passAndPlay.title}</div>
                  <div className="text-sm text-fg-muted">{t.home.gameMode.passAndPlay.description}</div>
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Player Count Selection - Only for pass-and-play */}
          {selectedGameMode === GameMode.PassAndPlay && (
            <Card variant="elevated">
              <CardBody className="space-y-3">
                <h3 className="text-lg font-bold text-fg text-center">
                  {t.home.gameMode.passAndPlay.playerCount}
                </h3>
                <div className="flex gap-2 justify-center flex-wrap">
                  {quickPlayerCounts.map((count) => (
                    <button
                      key={count}
                      onClick={() => setPlayerCount(count)}
                      className={`w-12 h-12 rounded-lg border-2 transition-all font-bold ${
                        playerCount === count && !showCustomCount
                          ? 'border-primary bg-primary text-primary-fg'
                          : 'border-border hover:border-primary hover:bg-primary-subtle text-fg'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowCustomCount(true)}
                    className={`px-4 h-12 rounded-lg border-2 transition-all font-bold ${
                      !quickPlayerCounts.includes(playerCount) || showCustomCount
                        ? 'border-primary bg-primary text-primary-fg'
                        : 'border-border hover:border-primary hover:bg-primary-subtle text-fg'
                    }`}
                  >
                    {t.home.gameMode.passAndPlay.customCount.button}
                  </button>
                </div>
                <p className="text-sm text-center text-fg-muted">
                  {t.home.gameMode.passAndPlay.playerNaming}
                </p>
                {!quickPlayerCounts.includes(playerCount) && !showCustomCount && (
                  <p className="text-sm text-center text-primary font-medium">
                    {playerCount} {t.home.gameMode.passAndPlay.customCount.playersSelected}
                  </p>
                )}
              </CardBody>
            </Card>
          )}

          {/* Theme Selection */}
          <Card variant="elevated">
            <CardBody className="space-y-3">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleCreate(true)}
                  disabled={loading || (selectedGameMode === GameMode.Online && !playerName.trim())}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  🎲 {t.home.randomTheme}
                </Button>
                <span className="text-sm font-medium text-gray-500 px-2">or</span>
                <Button
                  onClick={() => setShowThemes(!showThemes)}
                  disabled={selectedGameMode === GameMode.Online && !playerName.trim()}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  {showThemes ? `✕ ${t.common.close}` : `🎨 ${t.home.chooseTheme}`}
                </Button>
              </div>

              {showThemes && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3 border-t border-border">
                  {themes.map((theme) => {
                    const isLiked = hasUserLikedTheme(theme) || likedThemes.has(theme);

                    return (
                      <button
                        key={theme}
                        onClick={() => {
                          setSelectedTheme(theme);
                          handleCreate(false);
                        }}
                        disabled={loading}
                        className="p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary-subtle transition-all text-left disabled:opacity-50 relative group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{THEME_EMOJIS[theme]}</span>
                          <span className="font-medium text-fg flex-1">
                            {THEME_LABELS[theme]}
                          </span>
                          {/* Like button */}
                          <button
                            onClick={(e) => handleLikeTheme(theme, e)}
                            disabled={isLiked}
                            className={`text-xl transition-transform ${
                              isLiked
                                ? 'opacity-100 scale-110'
                                : 'opacity-50 group-hover:opacity-100 hover:scale-125'
                            }`}
                            title={isLiked ? 'Already liked' : 'Like this theme'}
                          >
                            {isLiked ? '❤️' : '🤍'}
                          </button>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Popular Themes Today - Dynamic tracking */}
          <PopularThemes
            onThemeSelect={(theme) => {
              setSelectedTheme(theme);
              handleCreate(false);
            }}
            selectedTheme={selectedTheme}
          />

          {/* Most Loved Themes - Community favorites */}
          <MostLovedThemes
            onThemeSelect={(theme) => {
              setSelectedTheme(theme);
              handleCreate(false);
            }}
            selectedTheme={selectedTheme}
          />
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
                <h3 className="font-bold mb-1 text-fg">{t.howToPlay.steps.step1.title}</h3>
                <p className="text-fg-muted text-sm" dangerouslySetInnerHTML={{ __html: t.howToPlay.steps.step1.description }} />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-3xl flex-shrink-0">2️⃣</div>
              <div>
                <h3 className="font-bold mb-1 text-fg">{t.howToPlay.steps.step2.title}</h3>
                <p className="text-fg-muted text-sm" dangerouslySetInnerHTML={{ __html: t.howToPlay.steps.step2.description }} />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-3xl flex-shrink-0">3️⃣</div>
              <div>
                <h3 className="font-bold mb-1 text-fg">{t.howToPlay.steps.step3.title}</h3>
                <p className="text-fg-muted text-sm">
                  {t.howToPlay.steps.step3.description}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-3xl flex-shrink-0">🎯</div>
              <div>
                <h3 className="font-bold mb-1 text-fg">{t.howToPlay.steps.win.title}</h3>
                <p className="text-sm text-success" dangerouslySetInnerHTML={{ __html: t.howToPlay.steps.win.players }} />
                <p className="text-sm text-danger" dangerouslySetInnerHTML={{ __html: t.howToPlay.steps.win.imposter }} />
              </div>
            </div>
          </div>

          {/* Example */}
          <div>
            <h3 className="font-bold mb-3 text-fg">{t.howToPlay.example.title}</h3>
            <div className="bg-gradient-to-b from-bg-subtle to-border rounded-2xl p-4 space-y-3 text-sm h-[600px] overflow-y-auto">
              {/* Invite */}
              <div className="flex justify-end">
                <div className="bg-primary text-primary-fg rounded-2xl px-4 py-2 max-w-[80%]">
                  {t.howToPlay.example.invite}<br/>
                  <span className="text-xs opacity-90">imposter.game/ABC123</span>
                </div>
              </div>

              {/* Joins */}
              <div className="flex justify-start">
                <div className="bg-bg-subtle text-fg rounded-2xl px-4 py-2 max-w-[80%]">
                  <strong>Sarah</strong><br/>
                  {t.howToPlay.example.joined}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-bg-subtle text-fg rounded-2xl px-4 py-2 max-w-[80%]">
                  <strong>Mike</strong><br/>
                  {t.howToPlay.example.imIn}
                </div>
              </div>

              {/* Game Start */}
              <div className="text-center">
                <span className="bg-fg-muted text-primary-fg text-xs px-3 py-1 rounded-full">
                  {t.howToPlay.example.gameStarting}
                </span>
              </div>

              {/* Role Reveals */}
              <div className="flex justify-end">
                <div className="bg-success text-primary-fg rounded-2xl px-4 py-2 max-w-[80%]">
                  <strong>{t.howToPlay.example.yourWord}</strong><br/>
                  🍕 PIZZA
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-success text-primary-fg rounded-2xl px-4 py-2 max-w-[70%]">
                  <strong>Sarah&apos;s word:</strong><br/>
                  🍕 PIZZA
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-danger text-primary-fg rounded-2xl px-4 py-2 max-w-[70%]">
                  <strong>Mike:</strong><br/>
                  🕵️ {t.howToPlay.example.imposterRole}
                </div>
              </div>

              {/* Clue Round */}
              <div className="text-center">
                <span className="bg-fg-muted text-primary-fg text-xs px-3 py-1 rounded-full">
                  {t.howToPlay.example.submitClues}
                </span>
              </div>

              <div className="flex justify-end">
                <div className="bg-primary text-primary-fg rounded-2xl px-4 py-2">
                  {t.howToPlay.example.myClue} &quot;Italian&quot;
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-bg-subtle text-fg rounded-2xl px-4 py-2">
                  <strong>Sarah:</strong> &quot;Cheese&quot;
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-bg-subtle text-fg rounded-2xl px-4 py-2">
                  <strong>Mike:</strong> &quot;Food&quot; 🤔
                </div>
              </div>

              {/* Discussion */}
              <div className="flex justify-end">
                <div className="bg-primary text-primary-fg rounded-2xl px-4 py-2 max-w-[80%]">
                  {t.howToPlay.example.discussion1}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-bg-subtle text-fg rounded-2xl px-4 py-2">
                  <strong>Sarah:</strong> {t.howToPlay.example.discussion2}
                </div>
              </div>

              {/* Voting */}
              <div className="text-center">
                <span className="bg-fg-muted text-primary-fg text-xs px-3 py-1 rounded-full">
                  {t.howToPlay.example.votingTime}
                </span>
              </div>

              <div className="flex justify-center">
                <div className="bg-primary-subtle border border-primary rounded-xl px-4 py-2 text-primary text-xs">
                  You {t.howToPlay.example.votedFor} Mike<br/>
                  Sarah {t.howToPlay.example.votedFor} Mike<br/>
                  Mike {t.howToPlay.example.votedFor} You
                </div>
              </div>

              {/* Result */}
              <div className="flex justify-center">
                <div className="bg-success text-primary-fg rounded-2xl px-6 py-3 font-bold text-center">
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

      {/* Custom Player Count Modal */}
      <Modal
        isOpen={showCustomCount}
        onClose={() => {
          setShowCustomCount(false);
          setCustomPlayerCount('');
        }}
        title={t.home.gameMode.passAndPlay.customCount.title}
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-fg-muted text-sm">
            {t.home.gameMode.passAndPlay.customCount.description}
          </p>
          <Input
            type="number"
            min="3"
            placeholder={t.home.gameMode.passAndPlay.customCount.placeholder}
            value={customPlayerCount}
            onChange={(e) => setCustomPlayerCount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomCountSubmit()}
            autoFocus
          />
          <div className="flex gap-3">
            <Button
              onClick={handleCustomCountSubmit}
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={!customPlayerCount || parseInt(customPlayerCount, 10) < 3}
            >
              {t.home.gameMode.passAndPlay.customCount.confirm}
            </Button>
            <Button
              onClick={() => {
                setShowCustomCount(false);
                setCustomPlayerCount('');
              }}
              variant="ghost"
              size="lg"
              className="flex-1"
            >
              {t.common.close}
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
