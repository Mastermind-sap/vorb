import { Devvit, useAsync } from '@devvit/public-api';
import { PageType, Props } from './main';
import { AppBar } from './AppBar';
import { Loader } from './Loader';

export const LeaderBoardPage: Devvit.BlockComponent<Props> = ({ navigate, context, gameType }) => {
  const subredditId = context.subredditId;
  const leaderboardKey = `leaderboard:${gameType}:${subredditId}`;
  const currentPlayer = context.userId ?? "anonymous";
  
  const { data: leaderboard, loading, error } = useAsync(async () => {
    const topPlayers = await context.redis.zRange(leaderboardKey, 0, 2, { 
      reverse: true, 
      by: 'rank'
    });
    console.log('Top players:', topPlayers);
    
    const score = await context.redis.zScore(leaderboardKey, currentPlayer);
    const rank = await context.redis.zRank(leaderboardKey, currentPlayer);

    // Fetch usernames for top players and current player
    const usernames = await Promise.all([
      ...topPlayers.map(player => 
        player.member === "anonymous" 
          ? Promise.resolve("Anonymous") 
          : context.reddit.getUserById(player.member).then(user => user?.username ?? 'Unknown')
      ),
      currentPlayer !== "anonymous" 
        ? context.reddit.getUserById(currentPlayer).then(user => user?.username ?? 'Unknown') 
        : Promise.resolve("Anonymous")
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
      <text color="red" size="large">Error: {error.message}</text>
    </vstack>
  );

  if (!leaderboard || leaderboard.topPlayers.length === 0) return (
    <vstack padding="medium" gap="medium" alignment="center middle" width="100%">
      <AppBar title={getTitle()} navigate={navigate} />
      <text color="neutral-content" size="large">No one has yet played the game.</text>
    </vstack>
  );
  leaderboard.topPlayers.forEach(player => console.log(player.member??"anot" ));
  console.log("MEI:" + currentPlayer);
  return (
    <vstack padding="medium" gap="medium" alignment="center middle" width="100%">
      <AppBar title={getTitle()} navigate={navigate} />
      
      {/* Top Players */}
      <vstack gap="small" width="100%" maxWidth="400px">
        {leaderboard.topPlayers.map((player, index) => {
          console.log(`player.member: "${player.member}", currentPlayer: "${currentPlayer}"`);
           const isCurrentPlayer = (player.member === currentPlayer) || 
           (player.member === 'anonymous' && currentPlayer === 'anonymous');
          return (
            <hstack 
              key={player.member} 
              gap="small" 
              alignment="center middle" 
              backgroundColor={isCurrentPlayer ? "upvote-background" : "neutral-background"} 
              padding="medium" 
              cornerRadius="medium"
              borderColor={!isCurrentPlayer ? "primary-border" : "neutral-border"}
              border="thin"
            >
              <text size="xlarge" weight="bold" color={"neutral-content"}>{index + 1}</text>
              <vstack grow alignment="center middle">
                <text size="large" weight="bold" color={"neutral-content-strong"}>{player.username}</text>
                <text size="medium" color={"neutral-content"}>Score: {player.score}</text>
              </vstack>
              {index === 0 && <icon name="star" color={isCurrentPlayer?"neutral-background":"primary-border"} size="large" />}
            </hstack>
          );
        })}
      </vstack>
  
      {/* Current Player (if not in top players) */}
      {leaderboard.playerRank !== null && !leaderboard.topPlayers.some(player => player.member === currentPlayer) && (
        <vstack 
          width="100%" 
          maxWidth="400px" 
          backgroundColor="upvote-background" 
          padding="medium" 
          cornerRadius="medium"
          borderColor="neutral-content"
          border="thin"
        >
          <hstack gap="small" alignment="center middle">
            <text size="xlarge" weight="bold" color="neutral-content">{leaderboard.playerRank}</text>
            <vstack grow alignment="center middle">
              <text size="large" weight="bold" color="neutral-content">{leaderboard.playerUsername}</text>
              <text size="medium" color="neutral-content">Score: {leaderboard.playerScore}</text>
            </vstack>
          </hstack>
        </vstack>
      )}
    </vstack>
  );
};