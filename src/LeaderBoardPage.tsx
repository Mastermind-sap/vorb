import { Devvit } from '@devvit/public-api';
import { PageType,Props } from './main';

export const LeaderBoardPage: Devvit.BlockComponent<Props> = ({ navigate }) => {
  return (
    <vstack padding="medium" gap="medium" alignment="top center">
      <text size="xxlarge" weight="bold">
        LeaderBoard Page
      </text>
      <button onPress={() => navigate(PageType.HOMEPAGE)}>
        Go Back to Home
      </button>
    </vstack>
  );
};