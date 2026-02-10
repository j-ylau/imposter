import type { Metadata } from 'next';
import { generateRoomSEO } from '@/lib/seo';

interface RoomLayoutProps {
  children: React.ReactNode;
  params: Promise<{ roomId: string }>;
}

export async function generateMetadata({ params }: RoomLayoutProps): Promise<Metadata> {
  const { roomId } = await params;
  return generateRoomSEO(roomId);
}

export default function RoomLayout({ children }: RoomLayoutProps) {
  return <>{children}</>;
}
