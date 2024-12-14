import { Devvit } from '@devvit/public-api';
import { PageType, Props } from './main';
import { AppBar } from './AppBar';

export const GameOverPage: Devvit.BlockComponent<Props> = ({navigate, score,setScore}) => {
  return (
    <vstack padding="medium" gap="medium" alignment="center" width="100%">
      <AppBar title="Game Over" navigate={navigate} />
      <text>Your Score: {score}</text>
      <button onPress={() => {setScore(0);navigate(PageType.PLAYPAGE);}}>Play Again</button>
    </vstack>
  );
};
