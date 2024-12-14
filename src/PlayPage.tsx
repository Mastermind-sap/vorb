import { Devvit, useState, useForm, useInterval } from '@devvit/public-api';
import { AppBar } from './AppBar';
import { PageType, Props } from './main';

export const PlayPage: Devvit.BlockComponent<Props> = ({ navigate, score,setScore,context }) => {
  const [currentWord, setCurrentWord] = useState('start');
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
    console.log(input, base);
    console.log(input.length, base.length);
    console.log(input.length !== base.length);
    if (input.length !== base.length) return false;
    let diffCount = 0;
    for (let i = 0; i < base.length; i++) {
      if (input[i] !== base[i]) diffCount++;
      if (diffCount > 1) return false;
    }
    console.log(diffCount);
    return diffCount === 1;
  };

  const handleWordSubmission = (submittedWord: string) => {
    console.log("Submitted word:", submittedWord);
    if (isValidWord(submittedWord, currentWord)) {
      setScore(score + 1);
      setCurrentWord(submittedWord);
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
        handleWordSubmission(values.word);
      }
    }
  );

  return (
    <vstack padding="medium" gap="medium" alignment="center" width="100%">
      <AppBar title="Play" navigate={navigate} />
      <text>Score: {score}</text>
      <text>Lives: {lives}</text>
      <text>Time Left: {timeLeft}s</text>
      <text>Current Word: {currentWord}</text>
      <button onPress={() => context.ui.showForm(inputForm)}>Enter word</button>
    </vstack>
  );
};
