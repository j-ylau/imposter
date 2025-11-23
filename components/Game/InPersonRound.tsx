'use client';

import { Room } from '@/schema';
import { Button } from '@/components/UI/Button';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { useTranslation } from '@/lib/i18n';

interface InPersonRoundProps {
  room: Room;
  onRevealImposter: () => void;
}

export function InPersonRound({ room, onRevealImposter }: InPersonRoundProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto">
      <Card variant="elevated">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-fg transition-colors">
            {t.inPersonRound.title}
          </h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🗣️</div>
            <p className="text-lg text-fg mb-4 transition-colors">
              {t.inPersonRound.subtitle}
            </p>
            <div className="bg-primary-subtle border-2 border-primary rounded-lg p-4 transition-colors">
              <h4 className="font-bold text-primary mb-2 transition-colors">
                {t.inPersonRound.instructions.title}
              </h4>
              <ul className="text-sm text-primary space-y-1 text-left">
                {t.inPersonRound.instructions.steps.map((step, index) => (
                  <li key={index}>• {step}</li>
                ))}
              </ul>
            </div>
          </div>

          <Button
            onClick={onRevealImposter}
            className="w-full"
            size="lg"
            variant="primary"
          >
            {t.inPersonRound.revealButton}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
