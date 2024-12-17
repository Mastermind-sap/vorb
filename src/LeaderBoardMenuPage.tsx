import { Devvit } from '@devvit/public-api';
import { PageType, Props } from './main';
import { AppBar } from './AppBar';

export const LeaderBoardMenuPage: Devvit.BlockComponent<Props> = ({ navigate }) => {
  const handleNavigateToLeaderboard = (gameType: string) => {
    navigate(PageType.LEADERBOARDPAGE, { gameType });
  };

  return (
    <vstack 
      height="100%" 
      width="100%" 
      gap="large" 
      alignment="center middle" 
      backgroundColor="neutral-background"
      padding="large"
    >
      <AppBar title="Select Leaderboard" navigate={navigate} />
      <vstack gap="medium" width="100%" maxWidth="300px">
        <button 
          appearance="primary" 
          size="large"
          onPress={() => handleNavigateToLeaderboard('wordLadder')}
        >
          Word Ladder
        </button>
        <button 
          appearance="secondary" 
          size="large"
          onPress={() => handleNavigateToLeaderboard('wordle')}
        >
          Wordle
        </button>
        <button 
          appearance="bordered" 
          size="large"
          onPress={() => handleNavigateToLeaderboard('wordRail')}
        >
          Word Rail
        </button>
      </vstack>
    </vstack>
  );
};
