import { Devvit, useState, useForm, useInterval } from '@devvit/public-api';
import { AppBar } from './AppBar';
import { PageType, Props } from './main';

export const PlayPage: Devvit.BlockComponent<Props> = ({ navigate, score,setScore,context }) => {
  const [currentWord, setCurrentWord] = useState('start');
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctWords, setCorrectWords] = useState(['start']);
  

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
    console.log(input, base);
    console.log(input.length, base.length);
    console.log(input.length !== base.length);
    if (input.length !== base.length) {
      context.ui.showToast({ text: "Word not of same size!", appearance: "neutral" });
      return false;
    }
    let diffCount = 0;
    for (let i = 0; i < base.length; i++) {
      if (input[i] !== base[i]) diffCount++;
      if (diffCount > 1) {
        context.ui.showToast({ text: "Words can differ by only one letter!", appearance: "neutral" });
        return false;
      }
    }
    console.log(diffCount);
    return diffCount === 1;
  };

  const handleWordSubmission = (submittedWord: string) => {
    console.log("Submitted word:", submittedWord);
    if (isValidWord(submittedWord, currentWord)) {
      setScore(score + 1);
      setCurrentWord(submittedWord);
      setCorrectWords([...correctWords, submittedWord]);
      console.log("New current word:", submittedWord);
    } else {
      console.log("Penalize");
      setLives(lives - 1);
      console.log("Lives:", lives - 1);
    }
  };

  const handleGameOver = () => {
    navigate(PageType.GAMEOVERPAGE);
  };

  // Handle game over scenario
  if (lives <= 0 || timeLeft <= 0) {
    console.log("Game Over");
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
      <AppBar title="Word Ladder Game" navigate={navigate} />
      
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
          Change one letter to form a new word
        </text>
        <vstack gap="small" width="100%">
          <text size="medium" weight="bold" color="neutral-content" alignment="center">Correct Words:</text>
          <hstack gap="small" alignment="center middle" width="100%">
            {correctWords.slice(-5).map((word, index) => (
              <text key={index.toString()} color="primary-plain">{word}</text>
            ))}
          </hstack>
        </vstack>
      </vstack>
    </vstack>
  );
};
