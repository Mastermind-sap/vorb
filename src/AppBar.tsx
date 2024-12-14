import { Devvit } from '@devvit/public-api';
import { PageType } from './main';

interface AppBarProps {
  title: string;
  navigate: (page: PageType) => void;
}

export const AppBar: Devvit.BlockComponent<AppBarProps> = ({ title, navigate }) => {
  return (
    <hstack 
      width="100%" 
      alignment="center middle" 
      padding="medium" 
      backgroundColor="neutral-background-strong"
      borderColor="primary-border"
      cornerRadius="medium" 
      border="thin"
    >
      <button 
        appearance="secondary" 
        icon="back" 
        onPress={() => navigate(PageType.HOMEPAGE)}
        size="small"
      />
      <spacer grow />
      <text 
        size="xlarge" 
        weight="bold" 
        color="neutral-content-strong"
        alignment="center"
      >
        {title}
      </text>
      <spacer grow />
    </hstack>
  );
};