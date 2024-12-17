import { Devvit, useState, useForm, useInterval } from '@devvit/public-api';
import { AppBar } from './AppBar';
import { PageType, Props } from './main';

export const WordRailPage: Devvit.BlockComponent<Props> = ({ navigate, score, setScore, context, finalWord="start" }) => {
  const [currentWord, setCurrentWord] = useState(finalWord);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);

  // Timer logic using useInterval
  const timer = useInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        timer.stop();
        handleGameOver();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  timer.start();

  const isValidWord = (input: string, base: string): boolean => {
    if (input[0] !== base[base.length - 1]) {
      context.ui.showToast({ text: "The first letter must match the last letter of the previous word!", appearance: "neutral" });
      return false;
    }
    return true;
  };

  const handleWordSubmission = (submittedWord: string) => {
    if (isValidWord(submittedWord, currentWord)) {
      setScore(score + 1);
      setCurrentWord(submittedWord);
    } else {
      setLives(lives - 1);
    }
  };

  const handleGameOver = () => {
    navigate(PageType.GAMEOVERPAGE);
  };

  // Handle game over scenario
  if (lives <= 0 || timeLeft <= 0) {
    handleGameOver();
  }

  const inputForm = useForm(
    {
      fields: [
        {
          type: 'string',
          name: 'word',
          label: 'Enter your word:',
        },
      ],
    },
    (values) => {
      if (values.word) {
        handleWordSubmission(values.word.toLowerCase());
      }
    }
  );

  return (
    <vstack padding="medium" gap="medium" alignment="center top" width="100%" height="100%">
      <AppBar title="Word Rail Game" navigate={navigate} />
      <vstack gap="medium" alignment="center middle" grow>
        <vstack gap="medium" alignment="center middle" cornerRadius="medium" backgroundColor="neutral-background-strong" padding="medium" width="100%">
          <text size="xlarge" weight="bold" color="neutral-content-strong">Current Word: {currentWord}</text>
          
          <hstack gap="medium" alignment="center middle">
            <vstack alignment="center middle">
              <hstack gap="small" alignment="center middle">
                <icon name="karma" color="primary-plain" />
                <text size="medium" weight="bold" color="neutral-content">Score</text>
              </hstack>
              <text size="large" color="primary-plain">{score}</text>
            </vstack>
            
            <vstack alignment="center middle">
              <hstack gap="small" alignment="center middle">
                <icon name="heart" color={lives > 1 ? "primary-plain" : "danger-plain"} />
                <text size="medium" weight="bold" color="neutral-content">Lives</text>
              </hstack>
              <text size="large" color={lives > 1 ? "primary-plain" : "danger-plain"}>{lives}</text>
            </vstack>
            
            <vstack alignment="center middle">
              <hstack gap="small" alignment="center middle">
                <icon name="loop" color={timeLeft > 10 ? "primary-plain" : "danger-plain"} />
                <text size="medium" weight="bold" color="neutral-content">Time Left</text>
              </hstack>
              <text size="large" color={timeLeft > 10 ? "primary-plain" : "danger-plain"}>{timeLeft}s</text>
            </vstack>
          </hstack>
        </vstack>
        
        <button 
          appearance="primary"
          size="large"
          icon="chat"
          onPress={() => context.ui.showForm(inputForm)}
        >
          Enter Word
        </button>
        
        <text size="small" color="neutral-content-weak">
          The first letter of the new word must match the last letter of the previous word
        </text>
      </vstack>
    </vstack>
  );
};
