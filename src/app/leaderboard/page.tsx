import { LeaderboardView } from './leaderboard-view';

export default function LeaderboardPage() {
  return (
    <main className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-serif text-center mb-2">Leaderboard</h1>
      <p className="text-slate-600 text-center mb-8">
        Top performers in Catching Unicorns
      </p>
      <LeaderboardView />
    </main>
  );
}


