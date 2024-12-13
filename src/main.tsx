// Learn more at developers.reddit.com/docs
import { Devvit } from '@devvit/public-api';
import { HomePage } from './HomePage';
import { PlayPage } from './PlayPage';
import { LeaderBoardPage } from './LeaderBoardPage';
import { HowToPlayPage } from './HowToPlayPage';

export enum PageType {
  HOMEPAGE,
  PLAYPAGE,
  LEADERBOARDPAGE,
  HOWTOPLAYPAGE,
}

export interface Props {
  // Define your props here
  navigate: (page: PageType) => void;
  setCount: (count: number) => void;
  count: number;
  // Add any other props you need
}

const App: Devvit.CustomPostComponent = ({ useState }: Devvit.Context) => {
  const [page, navigate] = useState(PageType.HOMEPAGE);
  const [count, setCount] = useState(0);

  const props = {
    navigate,
    setCount,
    count,
  };

  switch (page) {
    case PageType.PLAYPAGE:
      return <PlayPage {...props} />;
    case PageType.LEADERBOARDPAGE:
      return <LeaderBoardPage {...props} />;
    case PageType.HOWTOPLAYPAGE:
      return <HowToPlayPage {...props} />;
    default:
      return <HomePage {...props} />;
  }
};

Devvit.configure({
  redis: true,
  redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Play Word Ladder',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Submitting your post - upon completion you'll navigate there.");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Word Ladder',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.navigateTo(post);
  },
});

Devvit.addCustomPostType({
  name: 'Word Ladder App',
  height:"tall",
  render: App,
});

export default Devvit;
