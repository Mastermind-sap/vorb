import { Devvit } from '@devvit/public-api';
import { PageType, Props } from './main';
import { AppBar } from './AppBar';

export const PlayPage: Devvit.BlockComponent<Props> = ({ navigate, setCount, count }) => {
  return (
    <vstack padding="medium" gap="medium" alignment="center" width="100%">
      <AppBar title="Play" navigate={navigate} />
      <text>{count}</text>
      <button onPress={() => setCount(count + 1)}>
        Increment Count
      </button>
    </vstack>
  );
};