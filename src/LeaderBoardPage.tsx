import { Devvit } from '@devvit/public-api';
import { PageType, Props } from './main';

export const LeaderBoardPage: Devvit.BlockComponent<Props> = ({ navigate }) => {
  return (
    <vstack padding="medium" gap="medium" alignment="center" width="100%">
      <hstack width="100%" alignment="center middle">
        <button appearance="caution" icon='back' onPress={() => navigate(PageType.HOMEPAGE)} />
        <spacer grow />
        <text size="xxlarge" weight="bold">
          LeaderBoard
        </text>
        <spacer grow />
      </hstack>
    </vstack>
  );
};