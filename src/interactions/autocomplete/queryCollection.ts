import { ApplicationCommandOptionChoice, Collection } from "discord.js";
import _ from "lodash-es";
import GameData from "../../data/gameData.js";
import toSentenceCase from "../../modules/text/toSentenceCase.js";
import ValueOf from "../../types/ValueOf.js";
import ValueOfMap from "../../types/ValueOfMap.js";

//         (item.Name ?? item.$id).toLowerCase().startsWith(query.toLowerCase())

type SearchableCollection = ValueOf<typeof GameData>;
type SearchableItem = ValueOfMap<SearchableCollection>;

const maxOptions = 25;


/**
 * Generic function for querying the bot's game data.
 * @param query The user's input string.
 * @param collection The collection of game objects to be searched.
 * @returns An array of autocomplete result data.
 */
export default function queryCollection<T extends SearchableCollection>(query: string, collection: T): ApplicationCommandOptionChoice[] {
  let results: ApplicationCommandOptionChoice[] = [];
  let filtered: T;
  if (!query.length) {
    filtered = collection;
  } else {
    filtered = collection.filter(item => isAutocompleteMatch(query, item)) as T;
  }
  results = filtered.map((value: {$id: string, Name?: string | undefined}) => toAutocompleteOption(value)).slice(0,maxOptions);
  // console.log("autocomplete results:", results);
  return results;
}

/**
 * Tests whether an item's Name or $id contains a word starting with the query string.
 * @param query The query string
 * @param obj The object to be tested.
 * @returns True if it's a match, false if not.
 */
function isAutocompleteMatch(query: string, obj: {$id: string, Name?: string | undefined}): boolean {
  const normalizedQuery = query.toLowerCase();
  const idFragments = [...obj.$id.toLowerCase().split(/\W/)];
  if (obj.Name) {
    idFragments.push(...obj.Name.toLowerCase().split(/\W/));
  }
  if (idFragments.some(fragment => fragment.startsWith(normalizedQuery))) {
    return true;
  }
  return false;
}

/**
 * Transforms game data into an autocomplete option.
 * @param obj
 * @returns The autocomplete option data.
 */
function toAutocompleteOption(obj: {$id: string, Name?: string | undefined}): ApplicationCommandOptionChoice {
  return {
    name: toSentenceCase(obj.Name ?? obj.$id),
    value: obj.$id,
  };
}