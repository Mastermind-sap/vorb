import { Devvit } from '@devvit/public-api';
import { AppBar } from './AppBar';
import { PageType, Props } from './main';
import { words } from './dictionary';

export const PlayPage: Devvit.BlockComponent<Props> = ({ navigate }) => {
  const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

  return (
    <vstack 
      height="100%" 
      width="100%" 
      gap="large" 
      alignment="center middle" 
      backgroundColor="neutral-background"
      padding="large"
    >
      <AppBar title="Select Game Mode" navigate={navigate} />
      <vstack gap="medium" width="100%" maxWidth="300px">
        <button 
          appearance="primary" 
          size="large"
          onPress={() => navigate(PageType.WORDLADDERPAGE, { finalWord: getRandomWord() })}
        >
          Word Ladder
        </button>
        <button 
          appearance="secondary" 
          size="large"
          onPress={() => navigate(PageType.WORDLEPAGE, { finalWord: getRandomWord() })}
        >
          Wordle
        </button>
        <button 
          appearance="bordered" 
          size="large"
          onPress={() => navigate(PageType.WORDRAILPAGE, { finalWord: getRandomWord() })}
        >
          Word Rail
        </button>
      </vstack>
    </vstack>
  );
};
