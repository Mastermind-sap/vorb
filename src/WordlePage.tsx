import { Devvit, useState, useForm } from '@devvit/public-api';
import { AppBar } from './AppBar';
import { PageType, Props } from './main';

export const WordlePage: Devvit.BlockComponent<Props> = ({ navigate, score, setScore, context, finalWord ="default"}) => {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [lives, setLives] = useState(10);

  const handleWordSubmission = (submittedWord: string) => {
    if (submittedWord.length !== finalWord.length) {
      context.ui.showToast({ text: "Word not of the correct size!", appearance: "neutral" });
      return;
    }

    setGuesses([...guesses, submittedWord]);

    const newScore = calculateScore(submittedWord);
    if (newScore > score) {
      setScore(newScore);
    }

    if (submittedWord === finalWord) {
      context.ui.showToast({ text: "Congratulations! You've guessed the word!", appearance: "success" });
      navigate(PageType.GAMEOVERPAGE, { score: newScore, finalWord });
    } else {
      setLives(lives - 1);
      if (lives - 1 <= 0) {
        context.ui.showToast({ text: "Game Over! You've run out of guesses.", appearance: "neutral" });
        navigate(PageType.GAMEOVERPAGE, { score, finalWord});
      }
    }
  };

  const calculateScore = (submittedWord: string) => {
    let correctCount = 0;
    for (let i = 0; i < finalWord.length; i++) {
      if (submittedWord[i] === finalWord[i]) {
        correctCount++;
      }
    }
    return (correctCount / finalWord.length) * 100;
  };

  const inputForm = useForm(
    {
      fields: [
        {
          type: 'string',
          name: 'word',
          label: 'Enter your guess:',
        },
      ],
    },
    (values) => {
      if (values.word) {
        handleWordSubmission(values.word.toLowerCase());
      }
    }
  );

  const getLetterColor = (letter: string, index: number) => {
    if (finalWord[index] === letter) {
      return "green";
    } else if (finalWord.includes(letter)) {
      return "orange";
    } else {
      return "neutral-content";
    }
  };

  return (
    <vstack padding="medium" gap="medium" alignment="center top" width="100%" height="100%">
      <AppBar title="Wordle Game" navigate={navigate} />
      
      <vstack gap="medium" alignment="center middle" grow>
        <vstack gap="medium" alignment="center middle" cornerRadius="medium" backgroundColor="neutral-background-strong" padding="medium" width="100%">
          <text size="xlarge" weight="bold" color="neutral-content-strong">Guess the Word</text>
          <text size="large" color="neutral-content">Word Length: {finalWord.length}</text>
          
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
                <text size="medium" weight="bold" color="neutral-content">Guesses Left</text>
              </hstack>
              <text size="large" color={lives > 1 ? "primary-plain" : "danger-plain"}>{lives}</text>
            </vstack>
          </hstack>
        </vstack>
        
        <button 
          appearance="primary"
          size="large"
          icon="chat"
          onPress={() => context.ui.showForm(inputForm)}
        >
          Enter Guess
        </button>
        
        <vstack gap="small" width="100%">
          {guesses.slice(-2).map((guess, index) => (
            <hstack key={index.toString()} gap="small" alignment="center middle">
              {guess.split('').map((letter, i) => (
                <text key={i.toString()} size="large" color={getLetterColor(letter, i)}>{letter}</text>
              ))}
            </hstack>
          ))}
        </vstack>
      </vstack>
    </vstack>
  );
};
