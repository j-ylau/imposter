import { Room } from '@/schema';
import { Button } from '@/components/UI/Button';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { useTranslation } from '@/lib/i18n';
import { AdSense } from '@/components/Ads/AdSense';

interface RoleRevealProps {
  room: Room;
  isImposter: boolean;
  word?: string;
  onContinue: () => void;
}

export function RoleReveal({ room, isImposter, word, onContinue }: RoleRevealProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto">
      <Card variant="elevated">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-gray-900">
            {t.roleReveal.title}
          </h2>
        </CardHeader>
        <CardBody className="space-y-6">
          {isImposter ? (
            <>
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🕵️</div>
                <h3 className="text-3xl font-bold text-red-600 mb-2">
                  {t.roleReveal.imposter.title}
                </h3>
                <p className="text-gray-600">
                  {t.roleReveal.imposter.subtitle}
                </p>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-900 mb-2">{t.common.yourGoal}</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  {t.roleReveal.imposter.goals.map((goal, index) => (
                    <li key={index}>• {goal}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-8">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-3xl font-bold text-primary-600 mb-2">
                  {t.roleReveal.player.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t.roleReveal.player.subtitle}
                </p>
                <div className="text-5xl font-bold text-gray-900 bg-primary-50 border-4 border-primary-200 rounded-lg py-6 px-8 inline-block">
                  {word}
                </div>
              </div>
              <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
                <h4 className="font-bold text-primary-900 mb-2">{t.common.yourGoal}</h4>
                <ul className="text-sm text-primary-800 space-y-1">
                  {t.roleReveal.player.goals.map((goal, index) => (
                    <li key={index}>• {goal}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Ad - In-between Rounds */}
          <AdSense
            slot="INTERSTITIAL_SLOT"
            format="auto"
            className="my-4"
          />

          <Button onClick={onContinue} className="w-full" size="lg">
            {t.roleReveal.continueButton}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
