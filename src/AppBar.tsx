import { Devvit } from '@devvit/public-api';
import { PageType } from './main';

interface AppBarProps {
  title: string;
  navigate: (page: PageType) => void;
}

export const AppBar: Devvit.BlockComponent<AppBarProps> = ({ title, navigate }) => {
  return (
    <hstack width="100%" alignment="center middle" padding="small" borderColor='primary-border' cornerRadius='medium' border='thick'>
      <button appearance="bordered" icon='back' onPress={() => navigate(PageType.HOMEPAGE)} />
      <spacer grow />
      <text size="xxlarge" weight="bold" color="white">
        {title}
      </text>
      <spacer grow />
    </hstack>
  );
};