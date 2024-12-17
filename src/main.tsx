// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';
import { HomePage } from './HomePage';
import { PlayPage } from './PlayPage';
import { WordLadderPage } from './WordLadderPage';
import { WordlePage } from './WordlePage';
import { WordRailPage } from './WordRailPage';
import { LeaderBoardPage } from './LeaderBoardPage';
import { HowToPlayPage } from './HowToPlayPage';
import { GameOverPage } from './GameOverPage';
import { Loader } from './Loader';

export enum PageType {
  HOMEPAGE,
  PLAYPAGE,
  WORDLADDERPAGE,
  WORDLEPAGE,
  WORDRAILPAGE,
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
    case PageType.WORDLADDERPAGE:
      return <WordLadderPage {...props} />;
    case PageType.WORDLEPAGE:
      return <WordlePage {...props} />;
    case PageType.WORDRAILPAGE:
      return <WordRailPage {...props} />;
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
  label: 'Play Vorb',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Submitting your post - upon completion you'll navigate there.");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Vorb',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: <Loader />,
    });
    ui.navigateTo(post);
  },
});

Devvit.addCustomPostType({
  name: 'Vorb App',
  description: 'A word game',
  height: "tall",
  render: App,
});

// Menu item to show all Redis data
Devvit.addMenuItem({
  label: 'Show Leaderboard Data',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_, context) => {
    const { redis, ui, subredditId, reddit } = context;
    
    try {
      const leaderboardKey = `leaderboard:${subredditId}`;
      const totalEntries = await redis.zCard(leaderboardKey);
      const leaderboardData = await redis.zRange(leaderboardKey, 0, totalEntries-1, { by: 'rank'});
      console.log(totalEntries);
      console.log(leaderboardData);
      if (leaderboardData && leaderboardData.length > 0) {
        let leaderboardString = 'Leaderboard:\n';
        for (const { member, score } of leaderboardData) {
          const user = await reddit.getUserById(member);
          const username = user?.username ?? 'Anonymous';
          leaderboardString += `${username}: ${score}\n`;
        }
        ui.showToast('Leaderboard data logged to console.');
        console.log(leaderboardString);
      } else {
        ui.showToast('No leaderboard data found.');
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      ui.showToast('Failed to fetch leaderboard data. Check console for details.');
    }
  },
});

// Menu item to remove leaderboard data
Devvit.addMenuItem({
  label: 'Reset Leaderboard Data',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_, context) => {
    const { redis, ui, subredditId } = context;
    
    try {
      const leaderboardKey = `leaderboard:${subredditId}`;
      const totalEntries = await redis.zCard(leaderboardKey);
      
      if (totalEntries > 0) {
        // Remove all entries from the leaderboard
        await redis.zRemRangeByRank(leaderboardKey, 0, -1);
        ui.showToast(`Reseted ${totalEntries} entries from the leaderboard.`);
        console.log(`Reseted ${totalEntries} entries from the leaderboard.`);
      } else {
        ui.showToast('No leaderboard data found to reset.');
      }
    } catch (error) {
      console.error('Error removing leaderboard data:', error);
      ui.showToast('Failed to reset leaderboard data. Check console for details.');
    }
  },
});

export default Devvit;
