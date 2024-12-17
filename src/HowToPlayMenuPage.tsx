import { Devvit } from '@devvit/public-api';
import { PageType, Props } from './main';
import { AppBar } from './AppBar';

export const HowToPlayMenuPage: Devvit.BlockComponent<Props> = ({ navigate }) => {
  const handleNavigateToHowToPlay = (gameType: string) => {
    navigate(PageType.HOWTOPLAYPAGE, { gameType });
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
      <AppBar title="Select Game" navigate={navigate} />
      <vstack gap="medium" width="100%" maxWidth="300px">
        <button 
          appearance="primary" 
          size="large"
          onPress={() => handleNavigateToHowToPlay('wordLadder')}
        >
          Word Ladder
        </button>
        <button 
          appearance="secondary" 
          size="large"
          onPress={() => handleNavigateToHowToPlay('wordle')}
        >
          Wordle
        </button>
        <button 
          appearance="bordered" 
          size="large"
          onPress={() => handleNavigateToHowToPlay('wordRail')}
        >
          Word Rail
        </button>
      </vstack>
    </vstack>
  );
};
