import { Devvit } from '@devvit/public-api';

export const Loader: Devvit.BlockComponent = () => {
  return (
    <vstack height="100%" width="100%" alignment="middle center">
      <image 
        url="loader.gif" 
        imageWidth={100} 
        imageHeight={100} 
        height="50%" 
        width="50%" 
        resizeMode="fit" 
      />
      {/* <text size="large">Loading ...</text> */}
    </vstack>
  );
};
