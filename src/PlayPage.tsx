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
      padding='medium'
      gap='medium' 
      backgroundColor="neutral-background"
    >
      <AppBar title="Select Game Mode" navigate={navigate} />
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
            onPress={() => navigate(PageType.WORDLEPAGE, { finalWord: getRandomWord() })}
          >
            Wordle
          </button>
          <button 
            appearance="secondary" 
            size="large"
            grow
            onPress={() => navigate(PageType.WORDRAILPAGE, { finalWord: getRandomWord() })}
          >
            Word Rail
          </button>
          <button 
            appearance="bordered" 
            size="large"
            grow
            onPress={() => navigate(PageType.WORDLADDERPAGE, { finalWord: getRandomWord() })}
          >
            Word Ladder
          </button>
        </vstack>
      </vstack>
    </vstack>
  );
};
