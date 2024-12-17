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
      padding='medium'
      gap='medium' 
      backgroundColor="neutral-background"
    >
      <AppBar title="Select Leaderboard" navigate={navigate} />
      <vstack 
        grow 
        alignment="center middle" 
        padding="medium"
      >
        <vstack gap="medium" width="100%" maxWidth="300px">
          <button 
            appearance="primary" 
            size="large"
            grow
            onPress={() => handleNavigateToLeaderboard('wordle')}
          >
            Wordle
          </button>
          <button 
            appearance="secondary" 
            size="large"
            grow
            onPress={() => handleNavigateToLeaderboard('wordRail')}
          >
            Word Rail
          </button>
          <button 
            appearance="bordered" 
            size="large"
            grow
            onPress={() => handleNavigateToLeaderboard('wordLadder')}
          >
            Word Ladder
          </button>
        </vstack>
      </vstack>
    </vstack>
  );
};
