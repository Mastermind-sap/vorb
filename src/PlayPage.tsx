import { Devvit } from '@devvit/public-api';
import { PageType, Props } from './main';

export const PlayPage: Devvit.BlockComponent<Props> = ({ navigate, setCount, count }) => {
  return (
  <vstack padding="medium" gap="medium" alignment="center" width="100%">
    <hstack width="100%" alignment="center middle">
      <button appearance="caution" icon='back' onPress={() => navigate(PageType.HOMEPAGE)} />
      <spacer grow />
      <text size="xxlarge" weight="bold">
        Play
      </text>
      <spacer grow />
    </hstack>
    <text>{count}</text>
    <button onPress={() => setCount(count + 1)}>
      Increment Count
    </button>
  </vstack>
);
};