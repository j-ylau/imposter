export default function RoomLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-pulse">🕵️</div>
        <p className="text-lg text-fg-muted">Loading game...</p>
      </div>
    </div>
  );
}
