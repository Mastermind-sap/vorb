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
import { words } from './dictionary';
import { LeaderBoardMenuPage } from './LeaderBoardMenuPage';
import { HowToPlayMenuPage } from './HowToPlayMenuPage';

export enum PageType {
  HOMEPAGE,
  PLAYPAGE,
  WORDLADDERPAGE,
  WORDLEPAGE,
  WORDRAILPAGE,
  LEADERBOARDPAGE,
  HOWTOPLAYPAGE,
  GAMEOVERPAGE,
  LEADERBOARDMENUPAGE,
  HOWTOPLAYMENUPAGE,
}

export interface Props {
  navigate: (page: PageType, params?: any) => void;
  score: number;
  setScore: (score: number) => void;
  context: Devvit.Context;
  finalWord?: string;
  gameType?: string;
}

const App: Devvit.CustomPostComponent = (context) => {
  const [page, setPage] = useState(PageType.HOMEPAGE);
  const [score, setScore] = useState(0);
  const [finalWord, setFinalWord] = useState<string>('');
  const [gameType, setGameType] = useState<string>('');

  const navigate = (page: PageType, params?: any) => {
    if (params?.score !== undefined) {
      setScore(params.score);
    }
    if (params?.finalWord !== undefined) {
      setFinalWord(params.finalWord);
    } else {
      setFinalWord('');
    }
    if (params?.gameType !== undefined) {
      setGameType(params.gameType);
    } else {
      setGameType('');
    }
    setPage(page);
  };

  const props = {
    navigate,
    score,
    setScore,
    context,
    finalWord,
    gameType,
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
    case PageType.LEADERBOARDMENUPAGE:
      return <LeaderBoardMenuPage {...props} />;
    case PageType.HOWTOPLAYMENUPAGE:
      return <HowToPlayMenuPage {...props} />;
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

const showLeaderboardData = async (context: Devvit.Context, gameType: string) => {
  const { redis, ui, subredditId, reddit } = context;
  const leaderboardKey = `leaderboard:${gameType}:${subredditId}`;
  
  try {
    const totalEntries = await redis.zCard(leaderboardKey);
    const leaderboardData = await redis.zRange(leaderboardKey, 0, totalEntries - 1, { by: 'rank' });
    // console.log(totalEntries);
    // console.log(leaderboardData);
    if (leaderboardData && leaderboardData.length > 0) {
      let leaderboardString = `${gameType.charAt(0).toUpperCase() + gameType.slice(1)} Leaderboard:\n`;
      for (const { member, score } of leaderboardData) {
        const user = await reddit.getUserById(member);
        const username = user?.username ?? 'Anonymous';
        leaderboardString += `${username}: ${score}\n`;
      }
      ui.showToast(`${gameType.charAt(0).toUpperCase() + gameType.slice(1)} leaderboard data logged to console.`);
      console.log(leaderboardString);
    } else {
      ui.showToast(`No ${gameType} leaderboard data found.`);
    }
  } catch (error) {
    console.error(`Error fetching ${gameType} leaderboard data:`, error);
    ui.showToast(`Failed to fetch ${gameType} leaderboard data. Check console for details.`);
  }
};

const resetLeaderboardData = async (context: Devvit.Context, gameType: string) => {
  const { redis, ui, subredditId } = context;
  const leaderboardKey = `leaderboard:${gameType}:${subredditId}`;
  
  try {
    const totalEntries = await redis.zCard(leaderboardKey);
    
    if (totalEntries > 0) {
      // Remove all entries from the leaderboard
      await redis.zRemRangeByRank(leaderboardKey, 0, -1);
      ui.showToast(`Reset ${totalEntries} entries from the ${gameType} leaderboard.`);
      console.log(`Reset ${totalEntries} entries from the ${gameType} leaderboard.`);
    } else {
      ui.showToast(`No ${gameType} leaderboard data found to reset.`);
    }
  } catch (error) {
    console.error(`Error removing ${gameType} leaderboard data:`, error);
    ui.showToast(`Failed to reset ${gameType} leaderboard data. Check console for details.`);
  }
};

// Menu item to show all Leaderboard data
Devvit.addMenuItem({
  label: 'Show Leaderboard Data',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_, context) => {
    await showLeaderboardData(context, 'wordLadder');
    await showLeaderboardData(context, 'wordle');
    await showLeaderboardData(context, 'wordRail');
  },
});


// Devvit.addMenuItem({
//   label: 'Show Word Ladder Leaderboard Data',
//   location: 'subreddit',
//   forUserType: 'moderator',
//   onPress: async (_, context) => {
//     await showLeaderboardData(context, 'wordLadder');
//   },
// });

// Devvit.addMenuItem({
//   label: 'Show Wordle Leaderboard Data',
//   location: 'subreddit',
//   forUserType: 'moderator',
//   onPress: async (_, context) => {
//     await showLeaderboardData(context, 'wordle');
//   },
// });

// Devvit.addMenuItem({
//   label: 'Show Word Rail Leaderboard Data',
//   location: 'subreddit',
//   forUserType: 'moderator',
//   onPress: async (_, context) => {
//     await showLeaderboardData(context, 'wordRail');
//   },
// });


// Menu item to remove leaderboard data
Devvit.addMenuItem({
  label: 'Reset Leaderboard Data',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_, context) => {
    await resetLeaderboardData(context, 'wordLadder');
    await resetLeaderboardData(context, 'wordle');
    await resetLeaderboardData(context, 'wordRail');
  },
});

const DICTIONARY_HASH = 'word_dictionary';

// const hashWord = (word: string): string => {
//   return word.toLowerCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16);
// };

// Devvit.addTrigger({
//   event: 'AppUpgrade',
//   onEvent: async (_, context) => {
//     console.log('App installed');
//     try {
//       console.log('Storing hashed words in Redis..');
//       const batchSize = 100; // Adjust this value as needed
//       for (let i = 0; i < words.length; i += batchSize) {
//         const batch = words.slice(i, i + batchSize);
//         const batchObject: { [key: string]: string } = {};
//         for (const word of batch) {
//           // const hash = hashWord(word);
//           console.log(word);
//           batchObject[word] = word;
//         }
//         await context.redis.hSet(DICTIONARY_HASH, batchObject);
//         console.log(`Stored batch ${i / batchSize + 1}`);
//       }
//       console.log('Words hashed and stored in Redis successfully');
//     } catch (e) {
//       console.log('Error storing hashed words in Redis:', e);
//     }
//   },
// });

// Menu item to print all items in the hashed dictionary
Devvit.addMenuItem({
  label: 'Show Dictionary Data',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_, context) => {
    const { redis, ui } = context;
    
    try {
      const dictionaryData = await redis.hGetAll(DICTIONARY_HASH);
      
      if (dictionaryData && Object.keys(dictionaryData).length > 0) {
        let dictionaryString = 'Dictionary:\n';
        for (const [hash, word] of Object.entries(dictionaryData)) {
          dictionaryString += `${hash}: ${word}\n`;
        }
        ui.showToast('Dictionary data logged to console.');
        console.log(dictionaryString);
      } else {
        ui.showToast('No dictionary data found.');
      }
    } catch (error) {
      console.error('Error fetching dictionary data:', error);
      ui.showToast('Failed to fetch dictionary data. Check console for details.');
    }
  },
});

Devvit.addMenuItem({
  label: 'Initialize Dictionary',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_, context) => {
    const { redis, ui } = context;
    
    try {
      ui.showToast('Initializing dictionary...');
      console.log('Storing hashed words in Redis..');
      
      const batchSize = 100; // Adjust this value as needed
      for (let i = 0; i < words.length; i += batchSize) {
        const batch = words.slice(i, i + batchSize);
        const batchObject: { [key: string]: string } = {};
        for (const word of batch) {
          console.log(word);
          batchObject[word] = word;
        }
        await redis.hSet(DICTIONARY_HASH, batchObject);
        console.log(`Stored batch ${i / batchSize + 1}`);
      }
      
      console.log('Words hashed and stored in Redis successfully');
      ui.showToast('Dictionary initialized successfully');
    } catch (error) {
      console.error('Error initializing dictionary:', error);
      ui.showToast('Failed to initialize dictionary. Check console for details.');
    }
  },
});

// Menu item to reset the dictionary
Devvit.addMenuItem({
  label: 'Reset Dictionary Data',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_, context) => {
    const { redis, ui } = context;
    
    try {
      // Clear all entries in the dictionary hash
      await redis.del(DICTIONARY_HASH);
      
      ui.showToast('Dictionary has been reset.');
      console.log('Dictionary has been reset.');
    } catch (error) {
      console.error('Error resetting dictionary:', error);
      ui.showToast('Failed to reset dictionary. Check console for details.');
    }
  },
});

export default Devvit;
