import { Devvit, useState } from '@devvit/public-api';
import { PageType, Props } from './main';
import { AppBar } from './AppBar';

export const GameOverPage: Devvit.BlockComponent<Props> = ({navigate, score, setScore, context}) => {
  const [username, setUsername] = useState(async () => {
    const subredditId = context.subredditId;
    const leaderboardKey = `leaderboard:${subredditId}`;
    const userId = context.userId as string;

    // Get username
    const user = await context.reddit.getUserById(userId);
    const username = user?.username ?? 'Anonymous';

    // Get current score from leaderboard
    const currentScore = await context.redis.zScore(leaderboardKey, userId);

    // Update leaderboard only if new score is higher
    if (currentScore === null || currentScore === undefined || score > currentScore) {
      await context.redis.zAdd(leaderboardKey, { member: userId, score: score });
    }

    return username;
  });

  return (
    <vstack padding="medium" gap="medium" alignment="center" width="100%">
      <AppBar title="Game Over" navigate={navigate} />
      <text>{username}'s Score: {score}</text>
      <button onPress={() => {
        setScore(0);
        navigate(PageType.PLAYPAGE);
      }}>Play Again</button>
      <button onPress={() => navigate(PageType.LEADERBOARDPAGE)}>View Leaderboard</button>
    </vstack>
  );
};