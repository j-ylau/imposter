'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import { getAllLikeCounts, likeTheme } from '@/lib/theme-likes';
import { AdSense } from '@/components/Ads/AdSense';
import {
  hasCustomTheme as checkHasCustomTheme,
  getCustomTheme,
  saveCustomTheme,
  parseWords,
  deleteCustomTheme,
} from '@/lib/custom-theme';

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [playerName, setPlayerName] = useState('');
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>(GameMode.PassAndPlay);
  const [playerCount, setPlayerCount] = useState(4);
  const [customPlayerCount, setCustomPlayerCount] = useState('');
  const [showCustomCount, setShowCustomCount] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCustomThemeModal, setShowCustomThemeModal] = useState(false);
  const [customThemeInput, setCustomThemeInput] = useState('');
  const [customThemeError, setCustomThemeError] = useState('');
  const [hasCustomTheme, setHasCustomTheme] = useState(() =>
    typeof window !== 'undefined' ? checkHasCustomTheme() : false
  );
  const [favorites, setFavorites] = useState<Set<Theme>>(() =>
    typeof window !== 'undefined' ? new Set(getFavorites()) : new Set()
  );
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  const themes: Theme[] = Object.keys(THEME_LABELS) as Theme[];
  const quickPlayerCounts = [3, 4, 5, 6, 7, 8];

  useEffect(() => {
    getAllLikeCounts().then(setLikeCounts);
  }, []);

  const handleToggleFavorite = (theme: Theme, e: React.MouseEvent) => {
    e.stopPropagation();
    const nowFavorited = toggleFavorite(theme);
    setFavorites(new Set(getFavorites()));

    if (nowFavorited) {
      // Also send a like to Supabase for social proof
      likeTheme(theme);
      // Optimistic update for the count
      setLikeCounts((prev) => ({ ...prev, [theme]: (prev[theme] || 0) + 1 }));
    }

    toast.success(nowFavorited ? `${THEME_LABELS[theme]} added to favorites` : `${THEME_LABELS[theme]} removed from favorites`, { autoClose: 1500 });
  };

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

  const showNameValidationError = () => {
    toast.error(t.home.errors.invalidName);
    const nameInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (nameInput) {
      nameInput.focus();
      nameInput.classList.add('shake');
      setTimeout(() => nameInput.classList.remove('shake'), 500);
    }
  };

  const handleCreateCustomTheme = () => {
    setCustomThemeError('');
    const result = parseWords(customThemeInput);
    if (!result.valid) {
      setCustomThemeError(result.error || 'Invalid input');
      return;
    }
    const saved = saveCustomTheme(result.words);
    if (saved) {
      setHasCustomTheme(true);
      setShowCustomThemeModal(false);
      setCustomThemeInput('');
      toast.success(`Custom theme created with ${result.words.length} words!`);
    } else {
      toast.error('Failed to save custom theme');
    }
  };

  const handleUseCustomTheme = async () => {
    const words = getCustomTheme();
    if (!words || words.length === 0) {
      toast.error('Custom theme not found or expired');
      setHasCustomTheme(false);
      return;
    }
    const customWord = randomItem(words);
    if (selectedGameMode === GameMode.Online && !isValidPlayerName(playerName)) {
      showNameValidationError();
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (selectedGameMode === GameMode.PassAndPlay) {
        let room = createRoom('Player 1', 'pokemon', selectedGameMode);
        room = { ...room, word: customWord };
        for (let i = 2; i <= playerCount; i++) {
          room = addPlayer(room, `Player ${i}`);
        }
        room = startGame(room);
        await roomApi.createRoom(room);
        router.push(`/room/${room.id}`);
      } else {
        let room = createRoom(playerName, 'pokemon', selectedGameMode);
        room = { ...room, word: customWord };
        await roomApi.createRoom(room);
        localStorage.setItem('currentPlayerId', room.hostId);
        localStorage.setItem('currentPlayerName', playerName);
        router.push(`/room/${room.id}`);
      }
    } catch (err) {
      const appError = handleError(err);
      const errorKey = getErrorTranslationKey(appError.code);
      toast.error(t.errors[errorKey]);
      setLoading(false);
    }
  };

  const handleDeleteCustomTheme = () => {
    deleteCustomTheme();
    setHasCustomTheme(false);
    toast.success('Custom theme deleted');
  };

  const handleCreate = async (theme: Theme): Promise<void> => {
    if (selectedGameMode === GameMode.Online && !isValidPlayerName(playerName)) {
      showNameValidationError();
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (selectedGameMode === GameMode.PassAndPlay) {
        let room = createRoom('Player 1', theme, selectedGameMode);
        for (let i = 2; i <= playerCount; i++) {
          room = addPlayer(room, `Player ${i}`);
        }
        room = startGame(room);
        await roomApi.createRoom(room);
        trackThemeUsage(theme);
        router.push(`/room/${room.id}`);
      } else {
        const room = createRoom(playerName, theme, selectedGameMode);
        await roomApi.createRoom(room);
        trackThemeUsage(theme);
        localStorage.setItem('currentPlayerId', room.hostId);
        localStorage.setItem('currentPlayerName', playerName);
        router.push(`/room/${room.id}`);
      }
    } catch (err) {
      const appError = handleError(err);
      const errorKey = getErrorTranslationKey(appError.code);
      toast.error(t.errors[errorKey]);
      setLoading(false);
    }
  };

  const filteredThemes = (() => {
    if (selectedCategory === 'Favorites') return themes.filter((t) => favorites.has(t));
    if (selectedCategory === 'Popular') {
      return [...themes].sort((a, b) => (likeCounts[b] || 0) - (likeCounts[a] || 0));
    }
    return themes; // "All" — manifest order
  })();

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-5">

          {/* Hero */}
          <div className="text-center">
            <div className="text-7xl mb-3 animate-bounce-subtle">🕵️</div>
            <h1 className="text-4xl md:text-5xl font-black text-fg mb-2 tracking-tight">
              {t.home.title}
            </h1>
            <p className="text-lg text-fg-muted max-w-md mx-auto">
              {t.home.subtitle}
            </p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <Link
                href="/how-to-play"
                className="text-primary hover:text-primary-hover font-medium text-sm underline transition-colors"
              >
                {t.home.howToPlay}
              </Link>
              <span className="text-fg-subtle">|</span>
              <button
                onClick={() => router.push('/join')}
                className="text-primary hover:text-primary-hover font-medium text-sm underline transition-colors"
              >
                {t.home.joinRoom}
              </button>
            </div>
          </div>

          {/* Game Mode Toggle - compact */}
          <div className="flex items-center justify-center gap-1 bg-bg-subtle rounded-full p-1 max-w-xs mx-auto">
            <button
              onClick={() => setSelectedGameMode(GameMode.PassAndPlay)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${
                selectedGameMode === GameMode.PassAndPlay
                  ? 'bg-primary text-primary-fg shadow-md'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              📱 Pass & Play
            </button>
            <button
              onClick={() => setSelectedGameMode(GameMode.Online)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${
                selectedGameMode === GameMode.Online
                  ? 'bg-primary text-primary-fg shadow-md'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              🌐 Online
            </button>
          </div>

          {/* Name Input - Online only */}
          {selectedGameMode === GameMode.Online && (
            <Card variant="elevated">
              <CardBody>
                <Input
                  type="text"
                  placeholder={t.home.yourName}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate(randomItem(themes))}
                  error={error}
                  maxLength={20}
                  autoFocus
                />
              </CardBody>
            </Card>
          )}

          {/* Player Count - Pass & Play only */}
          {selectedGameMode === GameMode.PassAndPlay && (
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-fg-muted">{t.home.gameMode.passAndPlay.playerCount}</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {quickPlayerCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => setPlayerCount(count)}
                    className={`w-11 h-11 rounded-xl border-2 transition-all font-bold text-sm ${
                      playerCount === count
                        ? 'border-primary bg-primary text-primary-fg scale-110'
                        : 'border-border hover:border-primary text-fg'
                    }`}
                  >
                    {count}
                  </button>
                ))}
                <button
                  onClick={() => setShowCustomCount(true)}
                  className={`px-3 h-11 rounded-xl border-2 transition-all font-bold text-sm ${
                    !quickPlayerCounts.includes(playerCount)
                      ? 'border-primary bg-primary text-primary-fg'
                      : 'border-border hover:border-primary text-fg'
                  }`}
                >
                  {!quickPlayerCounts.includes(playerCount) ? playerCount : '+'}
                </button>
              </div>
            </div>
          )}

          {/* Quick Play Button */}
          <Button
            onClick={() => handleCreate(randomItem(themes))}
            disabled={loading}
            variant="primary"
            size="lg"
            className="w-full text-lg py-4"
          >
            {loading ? 'Creating...' : '🎲 Quick Play — Random Theme'}
          </Button>

          {/* Ad between CTA and themes — Auto Ads will fill if enabled */}
          <AdSense
            slot="HOME_MID"
            format="horizontal"
            className="my-2"
          />

          {/* Theme Selection - Always visible */}
          <Card variant="elevated">
            <CardBody className="space-y-3">
              <h3 className="text-base font-bold text-fg text-center">Or pick a theme</h3>

              {/* Filter tabs */}
              <div className="flex gap-1.5 justify-center">
                {(['All', 'Popular', ...(favorites.size > 0 ? ['Favorites'] : [])] as const).map((tab) => {
                  const labels: Record<string, string> = { All: 'All', Popular: '🔥 Popular', Favorites: '❤️ Favorites' };
                  return (
                    <button
                      key={tab}
                      onClick={() => setSelectedCategory(tab)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedCategory === tab
                          ? 'bg-primary text-primary-fg'
                          : 'bg-bg-subtle text-fg-muted hover:text-fg'
                      }`}
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </div>

              {/* Theme grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {/* Custom theme buttons */}
                {hasCustomTheme && (
                  <button
                    onClick={handleUseCustomTheme}
                    disabled={loading}
                    className="p-3 rounded-xl border-2 border-primary bg-primary-subtle hover:scale-[1.02] transition-all text-left disabled:opacity-50 relative"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✨</span>
                      <span className="font-semibold text-fg text-sm flex-1">Custom</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteCustomTheme(); }}
                        className="text-xs text-danger hover:text-danger-hover"
                      >
                        ✕
                      </button>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => setShowCustomThemeModal(true)}
                  className="p-3 rounded-xl border-2 border-dashed border-border hover:border-primary transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">➕</span>
                    <span className="font-semibold text-fg-muted text-sm">
                      {hasCustomTheme ? 'Edit' : 'Custom'}
                    </span>
                  </div>
                </button>

                {/* Theme buttons */}
                {filteredThemes.map((theme) => {
                  const count = likeCounts[theme] || 0;
                  return (
                    <div
                      key={theme}
                      className={`p-3 rounded-xl border-2 hover:border-primary hover:bg-primary-subtle hover:scale-[1.03] hover-wiggle transition-all text-left ${
                        loading ? 'opacity-50 pointer-events-none' : ''
                      } ${
                        favorites.has(theme) ? 'border-primary/40 bg-primary-subtle/30' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCreate(theme)}
                          disabled={loading}
                          className="flex items-center gap-2 flex-1 min-w-0 bg-transparent border-none p-0 cursor-pointer text-left"
                        >
                          <span className="text-xl">{THEME_EMOJIS[theme]}</span>
                          <span className="font-semibold text-fg text-sm flex-1">
                            {THEME_LABELS[theme]}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(theme, e)}
                          className="flex items-center gap-1 text-sm opacity-60 hover:opacity-100 transition-opacity"
                          aria-label={favorites.has(theme) ? `Remove ${THEME_LABELS[theme]} from favorites` : `Add ${THEME_LABELS[theme]} to favorites`}
                        >
                          {favorites.has(theme) ? '❤️' : '🤍'}
                          {count > 0 && <span className="text-[10px] text-fg-muted font-medium">{count}</span>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Bottom Ad — Auto Ads will fill if enabled */}
          <AdSense
            slot="HOME_BOTTOM"
            format="auto"
            className="mt-4"
          />
        </div>
      </div>

      {/* Custom Player Count Modal */}
      <Modal
        isOpen={showCustomCount}
        onClose={() => { setShowCustomCount(false); setCustomPlayerCount(''); }}
        title={t.home.gameMode.passAndPlay.customCount.title}
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-fg-muted text-sm">{t.home.gameMode.passAndPlay.customCount.description}</p>
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
              onClick={() => { setShowCustomCount(false); setCustomPlayerCount(''); }}
              variant="ghost"
              size="lg"
              className="flex-1"
            >
              {t.common.close}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Custom Theme Modal */}
      <Modal
        isOpen={showCustomThemeModal}
        onClose={() => { setShowCustomThemeModal(false); setCustomThemeInput(''); setCustomThemeError(''); }}
        title="Create Custom Theme"
        className="max-w-2xl"
      >
        <div className="space-y-4">
          <p className="text-fg-muted text-sm">
            Enter at least 8 words. Use commas or one word per line.
          </p>
          <textarea
            className="w-full h-40 p-3 rounded-xl border-2 border-border bg-bg text-fg focus:border-primary focus:outline-none resize-none font-mono text-sm"
            placeholder="Pizza, Burger, Pasta, Sushi, Tacos, Salad, Steak, Ramen"
            value={customThemeInput}
            onChange={(e) => { setCustomThemeInput(e.target.value); setCustomThemeError(''); }}
            autoFocus
          />
          <div className="text-sm text-fg-muted">
            {(() => {
              const result = parseWords(customThemeInput);
              return result.valid
                ? `${result.words.length} words ready`
                : customThemeInput.trim()
                ? `${result.words.length} words (need at least 8)`
                : 'Paste or type your words above';
            })()}
          </div>
          {customThemeError && <p className="text-sm text-danger">{customThemeError}</p>}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleCreateCustomTheme}
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={!parseWords(customThemeInput).valid}
            >
              Save Theme (24h)
            </Button>
            <Button
              onClick={() => { setShowCustomThemeModal(false); setCustomThemeInput(''); setCustomThemeError(''); }}
              variant="ghost"
              size="lg"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
