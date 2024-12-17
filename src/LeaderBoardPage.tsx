import { Devvit, useAsync } from '@devvit/public-api';
import { PageType, Props } from './main';
import { AppBar } from './AppBar';
import { Loader } from './Loader';

export const LeaderBoardPage: Devvit.BlockComponent<Props> = ({ navigate, context, gameType }) => {
  const subredditId = context.subredditId;
  const leaderboardKey = `leaderboard:${gameType}:${subredditId}`;

  const { data: leaderboard, loading, error } = useAsync(async () => {
    const topPlayers = await context.redis.zRange(leaderboardKey, 0, 2, { 
      reverse: true, 
      by: 'rank'
    });

    const currentPlayer = context.userId ?? "anonymous";
    const score = await context.redis.zScore(leaderboardKey, currentPlayer);
    const rank = await context.redis.zRank(leaderboardKey, currentPlayer);

    // Fetch usernames for top players and current player
    const usernames = await Promise.all([
      ...topPlayers.map(player => context.reddit.getUserById(player.member).then(user => user?.username ?? 'Unknown')),
      context.reddit.getUserById(currentPlayer).then(user => user?.username ?? 'Anonymous')
    ]);

    return {
      topPlayers: topPlayers.map((player, index) => ({
        member: player.member,
        score: player.score,
        username: usernames[index] ?? 'Unknown'
      })),
      playerScore: score ?? 0,
      playerRank: rank !== undefined ? rank + 1 : null,
      playerUsername: usernames[usernames.length - 1] ?? 'Anonymous'
    };
  }, { depends: gameType });

  const getTitle = () => {
    switch (gameType) {
      case 'wordLadder':
        return 'Word Ladder LeaderBoard';
      case 'wordle':
        return 'Wordle LeaderBoard';
      case 'wordRail':
        return 'Word Rail LeaderBoard';
      default:
        return 'LeaderBoard';
    }
  };

  if (loading) return <Loader />;
  if (error) return (
    <vstack padding="medium" gap="medium" alignment="center middle" width="100%">
      <AppBar title={getTitle()} navigate={navigate} />
      <text>Error: {error.message}</text>
    </vstack>
  );
  console.log('Leaderboard:', leaderboard);
  console.log('Top players:', (leaderboard?.topPlayers)??"NULL");
  if (!leaderboard || leaderboard.topPlayers.length === 0) return (
    <vstack padding="medium" gap="medium" alignment="center middle" width="100%">
      <AppBar title={getTitle()} navigate={navigate} />
      <text>No leaderboard data available yet. Please check back in a moment.</text>
    </vstack>
  );

  return (
    <vstack padding="medium" gap="medium" alignment="center" width="100%">
      <AppBar title={getTitle()} navigate={navigate} />
      {leaderboard.topPlayers.map((player, index) => (
        <hstack key={player.member} gap="small">
          <text>{index + 1}.</text>
          <text>{player.username}</text>
          <text>{player.score}</text>
        </hstack>
      ))}
      {leaderboard.playerRank !== null && leaderboard.playerRank > 3 && (
        <hstack gap="small">
          <text>...</text>
          <text>{leaderboard.playerRank}.</text>
          <text>{leaderboard.playerUsername}</text>
          <text>{leaderboard.playerScore}</text>
        </hstack>
      )}
    </vstack>
  );
};