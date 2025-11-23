import { Room } from '@/schema';
import { Button } from '@/components/UI/Button';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { useTranslation } from '@/lib/i18n';

interface RevealCluesProps {
  room: Room;
  currentPlayerId: string;
  onContinue: () => void;
}

export function RevealClues({ room, currentPlayerId, onContinue }: RevealCluesProps) {
  const { t } = useTranslation();
  const isHost = room.hostId === currentPlayerId;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-gray-900">
            {t.revealClues.title}
          </h2>
          <p className="text-center text-gray-600 mt-2">
            {t.revealClues.subtitle}
          </p>
        </CardHeader>
        <CardBody className="space-y-3">
          {room.clues.map((clue, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-900">
                {clue.playerName}
              </span>
              <span className="text-2xl font-bold text-primary-600">
                {clue.clue}
              </span>
            </div>
          ))}
        </CardBody>
      </Card>

      {isHost && (
        <Card variant="elevated">
          <CardBody>
            <Button onClick={onContinue} className="w-full" size="lg">
              {t.revealClues.continueButton}
            </Button>
          </CardBody>
        </Card>
      )}

      {!isHost && (
        <Card variant="bordered">
          <CardBody>
            <p className="text-center text-gray-600">
              {t.revealClues.waitingForHost}
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
