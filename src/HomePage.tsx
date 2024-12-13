import { Devvit } from '@devvit/public-api';
import { PageType,Props } from './main';

export const HomePage: Devvit.BlockComponent<Props> = ({ navigate }) => {
  return (
    <vstack height="100%" width="100%" gap="medium" alignment="center middle" backgroundColor='black'>
      <image
        url="icon.png"
        description="logo"
        imageHeight={512}
        imageWidth={512}
        height="50%"
        width="50%"
        resizeMode="fit"
      />
      <spacer size="medium" />
      {/* <text size="large">{`Click counter: ${counter}`}</text> */}
      <button appearance="primary" width="200px" onPress={() => navigate(PageType.PLAYPAGE)}>
        Play
      </button>
      <button appearance="secondary" width="200px" onPress={() => navigate(PageType.LEADERBOARDPAGE)}>
        LeaderBoard
      </button>
      <button appearance="bordered" width="200px" onPress={() => navigate(PageType.HOWTOPLAYPAGE)}>
        How to Play?
      </button>
    </vstack>
  );
};