import { Devvit } from '@devvit/public-api';
import { PageType, Props } from './main';
import { AppBar } from './AppBar';

export const LeaderBoardPage: Devvit.BlockComponent<Props> = ({ navigate }) => {
  return (
    <vstack padding="medium" gap="medium" alignment="center" width="100%">
      <AppBar title="LeaderBoard" navigate={navigate} />
    </vstack>
  );
};