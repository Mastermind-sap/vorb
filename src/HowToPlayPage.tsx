import { Devvit } from '@devvit/public-api';
import { AppBar } from './AppBar';
import { PageType, Props } from './main';

export const HowToPlayPage: Devvit.BlockComponent<Props> = ({ navigate, gameType }) => {
  const getInstructions = () => {
    switch (gameType) {
      case 'wordLadder':
        return (
          <>
            <text size="large" color="neutral-content-strong" wrap>Word Ladder Instructions:</text>
            <text size="medium" color="neutral-content" wrap>1. Start with a given word.</text>
            <text size="medium" color="neutral-content" wrap>2. Change one letter to form a new valid word.</text>
            {/* <text size="medium" color="neutral-content" wrap>3. Repeat until you reach the final word.</text> */}
            <text size="medium" color="neutral-content" wrap>3. Each valid word earns you points.</text>
          </>
        );
      case 'wordle':
        return (
          <>
            <text size="large" color="neutral-content-strong" wrap>Wordle Instructions:</text>
            <text size="medium" color="neutral-content" wrap>1. Guess the hidden word within a limited number of attempts.</text>
            <text size="medium" color="neutral-content" wrap>2. Each guess must be a valid word of the same length.</text>
            <text size="medium" color="neutral-content" wrap>3. After each guess, the color of the letters will change to show how close your guess was to the word.</text>
            <text size="medium" color="neutral-content" wrap>4. Green indicates the letter is correct and in the right position.</text>
            <text size="medium" color="neutral-content" wrap>5. Orange indicates the letter is correct but in the wrong position.</text>
            <text size="medium" color="neutral-content" wrap>6. Gray indicates the letter is not in the word.</text>
          </>
        );
      case 'wordRail':
        return (
          <>
            <text size="large" color="neutral-content-strong" wrap>Word Rail Instructions:</text>
            <text size="medium" color="neutral-content" wrap>1. Start with a given word.</text>
            <text size="medium" color="neutral-content" wrap>2. The first letter of the new word must match the last letter of the previous word.</text>
            <text size="medium" color="neutral-content" wrap>3. Enter valid words to continue the chain.</text>
            <text size="medium" color="neutral-content" wrap>4. Each valid word earns you points.</text>
          </>
        );
      default:
        return <text size="medium" color="neutral-content" wrap>Select a game to see the instructions.</text>;
    }
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
      <AppBar title="How to Play" navigate={navigate} />
      <vstack gap="medium" maxWidth="80%">
        {getInstructions()}
      </vstack>
    </vstack>
  );
};