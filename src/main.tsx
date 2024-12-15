// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';
import { HomePage } from './HomePage';
import { PlayPage } from './PlayPage';
import { LeaderBoardPage } from './LeaderBoardPage';
import { HowToPlayPage } from './HowToPlayPage';
import { GameOverPage } from './GameOverPage';
import { Loader } from './Loader';

export enum PageType {
  HOMEPAGE,
  PLAYPAGE,
  LEADERBOARDPAGE,
  HOWTOPLAYPAGE,
  GAMEOVERPAGE,
}

export interface Props {
  navigate: (page: PageType, params?: any) => void;
  score: number;
  setScore: (score: number) => void;
  context: Devvit.Context;
}

const App: Devvit.CustomPostComponent = (context) => {
  const [page, setPage] = useState(PageType.HOMEPAGE);
  const [score, setScore] = useState(0);

  const navigate = (page: PageType, params?: any) => {
    if (params?.score !== undefined) {
      setScore(params.score);
    }
    setPage(page);
  };

  const props = {
    navigate,
    score,
    setScore,
    context
  };

  switch (page) {
    case PageType.PLAYPAGE:
      return <PlayPage {...props} />;
    case PageType.LEADERBOARDPAGE:
      return <LeaderBoardPage {...props} />;
    case PageType.HOWTOPLAYPAGE:
      return <HowToPlayPage {...props} />;
    case PageType.GAMEOVERPAGE:
      return <GameOverPage {...props} />;
    default:
      return <HomePage {...props} />;
  }
};

Devvit.configure({
  redis: true,
  redditAPI: true,
  http:true,
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
      preview: <Loader />,
    });
    ui.navigateTo(post);
  },
});

Devvit.addCustomPostType({
  name: 'Word Ladder App',
  description: 'A word ladder game',
  height: "tall",
  render: App,
});

export default Devvit;
