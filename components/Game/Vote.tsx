import { useState } from 'react';
import { Room, Player } from '@/schema';
import { Button } from '@/components/UI/Button';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { useTranslation } from '@/lib/i18n';

interface VoteProps {
  room: Room;
  currentPlayerId: string;
  onVote: (targetId: string) => void;
}

export function Vote({ room, currentPlayerId, onVote }: VoteProps) {
  const { t, format } = useTranslation();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const hasVoted = room.votes.some((v) => v.voterId === currentPlayerId);
  const votedCount = room.votes.length;
  const totalPlayers = room.players.length;

  const handleVote = () => {
    if (selectedPlayerId) {
      onVote(selectedPlayerId);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card variant="elevated">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-gray-900">
            {t.vote.title}
          </h2>
          <p className="text-center text-gray-600 mt-2">
            {format(t.vote.progress, { voted: votedCount, total: totalPlayers })}
          </p>
        </CardHeader>
        <CardBody className="space-y-6">
          {hasVoted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🗳️</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                {t.vote.submitted.title}
              </h3>
              <p className="text-gray-600">
                {t.common.waiting}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {room.players
                  .filter((p) => p.id !== currentPlayerId)
                  .map((player) => (
                    <button
                      key={player.id}
                      onClick={() => setSelectedPlayerId(player.id)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedPlayerId === player.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium text-gray-900">
                        {player.name}
                      </span>
                    </button>
                  ))}
              </div>

              <Button
                onClick={handleVote}
                disabled={!selectedPlayerId}
                className="w-full"
                size="lg"
              >
                {t.vote.submitButton}
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
