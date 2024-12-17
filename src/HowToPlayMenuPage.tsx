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
      padding='medium'
      gap='medium' 
      backgroundColor="neutral-background"
    >
      <AppBar title="Select Game" navigate={navigate} />
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
            onPress={() => handleNavigateToHowToPlay('wordle')}
          >
            Wordle
          </button>
          <button 
            appearance="secondary" 
            size="large"
            grow
            onPress={() => handleNavigateToHowToPlay('wordRail')}
          >
            Word Rail
          </button>
          <button 
            appearance="bordered" 
            size="large"
            grow
            onPress={() => handleNavigateToHowToPlay('wordLadder')}
          >
            Word Ladder
          </button>
        </vstack>
      </vstack>
    </vstack>
  );
};
