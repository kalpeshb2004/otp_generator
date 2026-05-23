export default function LiveBadge({ active = true }: { active?: boolean }) {
  return (
    <span className={`flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full border ${
      active
        ? 'text-primary border-primary/30 bg-primary/10'
        : 'text-gray-500 border-gray-700 bg-gray-900'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary animate-pulse2' : 'bg-gray-600'}`} />
      {active ? 'LIVE' : 'EXPIRED'}
    </span>
  );
}
