import { Devvit } from "@devvit/public-api";

const DICTIONARY_HASH = 'word_dictionary';

const isValidEnglishWord = async (word: string, context: Devvit.Context): Promise<boolean> => {
  console.log(`Validating dictionary word: ${word}`);
  const exists = await context.redis.hGet(DICTIONARY_HASH, word);
  console.log(`Is valid?:${exists!==undefined}`);
  return exists !== undefined;
};

export default isValidEnglishWord;
