import { useState } from 'react';
import { Room } from '@/schema';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { useTranslation } from '@/lib/i18n';

interface SubmitClueProps {
  room: Room;
  currentPlayerId: string;
  onSubmit: (clue: string) => void;
}

export function SubmitClue({ room, currentPlayerId, onSubmit }: SubmitClueProps) {
  const { t, format } = useTranslation();
  const [clue, setClue] = useState('');
  const [error, setError] = useState('');

  const hasSubmitted = room.clues.some((c) => c.playerId === currentPlayerId);
  const submittedCount = room.clues.length;
  const totalPlayers = room.players.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedClue = clue.trim();

    if (!trimmedClue) {
      setError(t.submitClue.errors.empty);
      return;
    }

    if (trimmedClue.split(' ').length > 1) {
      setError(t.submitClue.errors.multipleWords);
      return;
    }

    if (trimmedClue.length > 20) {
      setError(t.submitClue.errors.tooLong);
      return;
    }

    onSubmit(trimmedClue);
    setClue('');
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card variant="elevated">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-gray-900">
            {t.submitClue.title}
          </h2>
          <p className="text-center text-gray-600 mt-2">
            {format(t.submitClue.progress, { submitted: submittedCount, total: totalPlayers })}
          </p>
        </CardHeader>
        <CardBody className="space-y-6">
          {hasSubmitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                {t.submitClue.submitted.title}
              </h3>
              <p className="text-gray-600">
                {t.common.waiting}
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">{t.common.rules}</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {t.submitClue.rules.map((rule, index) => (
                    <li key={index}>• {rule}</li>
                  ))}
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder={t.submitClue.placeholder}
                  value={clue}
                  onChange={(e) => setClue(e.target.value)}
                  error={error}
                  autoFocus
                  maxLength={20}
                />
                <Button type="submit" className="w-full" size="lg">
                  {t.submitClue.submitButton}
                </Button>
              </form>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
