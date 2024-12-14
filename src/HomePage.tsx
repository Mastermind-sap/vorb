import { Devvit } from '@devvit/public-api';
import { PageType, Props } from './main';

export const HomePage: Devvit.BlockComponent<Props> = ({ navigate, setScore }) => {
  return (
    <vstack 
      height="100%" 
      width="100%" 
      gap="large" 
      alignment="center middle" 
      backgroundColor="neutral-background"
      padding="large"
    >
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
      <vstack gap="medium" width="100%" maxWidth="300px">
        <button 
          appearance="primary" 
          size="large"
          onPress={() => {
            setScore(0);
            navigate(PageType.PLAYPAGE);
          }}
        >
          Play
        </button>
        <button 
          appearance="secondary" 
          size="large"
          onPress={() => navigate(PageType.LEADERBOARDPAGE)}
        >
          LeaderBoard
        </button>
        <button 
          appearance="bordered" 
          size="large"
          onPress={() => navigate(PageType.HOWTOPLAYPAGE)}
        >
          How to Play?
        </button>
      </vstack>
    </vstack>
  );
};