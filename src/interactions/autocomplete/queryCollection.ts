import { ApplicationCommandOptionChoice, Collection } from "discord.js";
import IGameObject from "../../modules/inventory/IGameObject.js";
import toSentenceCase from "../../modules/text/toSentenceCase.js";

const maxOptions = 25;

/**
 * Generic function for querying the bot's game data.
 * @param query The user's input string.
 * @param collection The collection of game objects to be searched.
 * @returns An array of autocomplete result data.
 */
export default function queryCollection<T extends IGameObject>(query: string, collection: Collection<string, T>): ApplicationCommandOptionChoice[] {
  let results: ApplicationCommandOptionChoice[] = [];
  let filtered: typeof collection;
  if (!query.length) {
    filtered = collection;
  } else {
    filtered = collection.filter(item => isAutocompleteMatch(query, item));
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