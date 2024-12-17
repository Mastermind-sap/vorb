import { Devvit, useState, useForm, useInterval, useAsync } from '@devvit/public-api';
import { AppBar } from './AppBar';
import { PageType, Props } from './main';
import isValidEnglishWord from './validateWord';

export const WordLadderPage: Devvit.BlockComponent<Props> = ({ navigate, score, setScore, context,finalWord="start" }) => {
  const [currentWord, setCurrentWord] = useState(finalWord);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [inputWord, setInputWord] = useState('');
  const [correctWords, setCorrectWords] = useState([finalWord]);
  
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

  const { data: isValid, loading, error } = useAsync(async () => {
    if (inputWord) {
      if (inputWord.length !== currentWord.length) 
        return 'invalid_length';
      let diffCount = 0;
      for (let i = 0; i < currentWord.length; i++) {
        if (inputWord[i] !== currentWord[i]) diffCount++;
        if (diffCount > 1) {
          return 'invalid_diff';
        }
      }
      if (diffCount !== 1) {
        return 'invalid_diff';
      }
      return await isValidEnglishWord(inputWord, context);
    }
    return false;
  }, { depends: { inputWord, currentWord }});

  const handleWordSubmission = (submittedWord: string) => {
    setInputWord(submittedWord.toLowerCase());
  };

  const handleGameOver = () => {
    navigate(PageType.GAMEOVERPAGE, {gameType: 'wordLadder'});
  };

  // Handle game over scenario
  if (lives <= 0 || timeLeft <= 0) {
    handleGameOver();
  }

  // Use useForm for input handling
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

  // Effect to handle word validation result
  if (!loading && inputWord) {
    if (error) {
      context.ui.showToast({ text: "Error validating word!", appearance: "neutral" });
    } else if (isValid === 'invalid_length') {
      context.ui.showToast({ text: "Word not of same size!", appearance: "neutral" });
      // setLives(lives - 1);
    } else if (isValid === 'invalid_diff') {
      context.ui.showToast({ text: "Words can differ by only one letter!", appearance: "neutral" });
      setLives(lives - 1);
    } else if (isValid === false) {
      context.ui.showToast({ text: "The word is not a valid English word!", appearance: "neutral" });
      setLives(lives - 1);
    } else if (isValid === true) {
      setScore(score + 1);
      setCurrentWord(inputWord);
      setCorrectWords([...correctWords, inputWord]);
    }
    setInputWord(''); // Reset input word after processing
  }

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
