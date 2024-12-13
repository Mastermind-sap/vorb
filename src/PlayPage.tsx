import { Devvit } from '@devvit/public-api';
import { PageType,Props } from './main';

export const PlayPage: Devvit.BlockComponent<Props> = ({ navigate, setCount, count }) => {
  return (
    <vstack padding="medium" gap="medium" alignment="top center">
      <text size="xxlarge" weight="bold">
        Play Page
      </text>
      <text>{count}</text>
      <button onPress={() => setCount(count + 1)}>
        Increment Count
      </button>
      <button onPress={() => navigate(PageType.HOMEPAGE)}>
        Go Back to Home
      </button>
    </vstack>
  );
};