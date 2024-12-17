import { Devvit, useAsync } from '@devvit/public-api';
import { PageType, Props } from './main';
import { AppBar } from './AppBar';
import { Loader } from './Loader';

export const GameOverPage: Devvit.BlockComponent<Props> = ({navigate, score, setScore, context, finalWord}) => {
  const { data: username, loading, error } = useAsync(async () => {
    try {
      console.log(`Updating....`);
      const subredditId = context.subredditId;
      const leaderboardKey = `leaderboard:${subredditId}`;
      const userId = context.userId as string;
      console.log(`User ID: ${userId}`);

      // Get username
      let username;
      try {
        const user = await context.reddit.getUserById(userId);
        username = user?.username ?? 'Anonymous';
        console.log(`User: ${username}`);
      } catch (error) {
        console.error('Error fetching user:', error);
        username = 'Anonymous';
      }

      // Get current score from leaderboard
      let currentScore;
      try {
        currentScore = await context.redis.zScore(leaderboardKey, userId);
        console.log(`Current score: ${currentScore}`);
      } catch (error) {
        console.error('Error fetching current score:', error);
      }

      // Update leaderboard only if new score is higher
      console.log(`Conditions for updating: ${currentScore === null || currentScore === undefined || score > currentScore}`);
      if (currentScore === null || currentScore === undefined || score > currentScore) {
        try {
          await context.redis.zAdd(leaderboardKey, { member: userId, score: score });
          console.log(`Score saved for user ${userId}: ${score}`);
        } catch (error) {
          console.error('Error updating leaderboard:', error);
        }
      }

      return username;
    } catch (error) {
      console.error('Unexpected error:', error);
      throw error;
    }
  }, { depends: [context.subredditId ?? '', context.userId ?? '', score] });

  if (loading) return <Loader />;
  if (error) return (
    <vstack padding="medium" gap="medium" alignment="center middle" width="100%">
      <AppBar title="Game Over" navigate={navigate} />
      <text>Error: {error.message}</text>
    </vstack>
  );

  return (
    <vstack padding="medium" gap="medium" alignment="center" width="100%">
      <AppBar title="Game Over" navigate={navigate} />
      <text>{username}'s Score: {score}</text>
      {finalWord!=""&&finalWord ? <text>The word was: {finalWord}</text> : null}
      <button onPress={() => {
        setScore(0);
        navigate(PageType.PLAYPAGE);
      }}>Play Again</button>
      <button onPress={() => navigate(PageType.LEADERBOARDPAGE)}>View Leaderboard</button>
    </vstack>
  );
};