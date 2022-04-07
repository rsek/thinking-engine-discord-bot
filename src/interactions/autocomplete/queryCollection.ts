import type { ApplicationCommandOptionChoice, Collection } from "discord.js";
import _ from "lodash-es";
import type IGameObject from "../../modules/inventory/IGameObject.js";
import toSentenceCase from "../../modules/text/toSentenceCase.js";

const MAX_OPTIONS = 25;

/**
 * Generic function for querying the bot's game data.
 * @param query The user's input string.
 * @param collection The collection of game objects to be searched.
 * @returns An array of autocomplete result data.
 */
export default function queryCollection<T extends IGameObject>(query: string, collection: Collection<string, T>): ApplicationCommandOptionChoice[] {
  let results: ApplicationCommandOptionChoice[] = [];
  // let filtered: typeof collection;
  let filtered: IGameObject[];
  if (query.length === 0) {
    // filtered = collection;
    filtered = Array.from(collection.values());
  } else {
    // collection.filter doesn't work correctly???
    // TODO: file a discord.js bug report for that
    // filtered = collection.filter(item => isAutocompleteMatch(query, item));
    filtered = _.filter(Array.from(collection.values()), (item) => isAutocompleteMatch(query, item));
  }
  // results = filtered.map((value) => toAutocompleteOption(value)).slice(0,MAX_OPTIONS);
  results = filtered.slice(0, MAX_OPTIONS).map((value) => toAutocompleteOption(value));
  // console.log("query:", `"${query}"`, "\nautocomplete results:", results);
  return results;
}

/**
 * Tests whether an item's Name or $id contains a word starting with the query string.
 * @param query The query string
 * @param obj The object to be tested.
 * @returns True if it's a match, false if not.
 */
function isAutocompleteMatch(query: string, obj: IGameObject): boolean {
  const normalizedQuery = query.toLowerCase();
  const idFragments = obj.$id.toLowerCase().split(/\W/);
  if (obj.Name) {
    idFragments.push(...obj.Name.toLowerCase().split(/\W/));
  }
  const result = idFragments.some(fragment => fragment.startsWith(normalizedQuery));
  // console.log("comparison",result,normalizedQuery, idFragments);
  return result;
}

/**
 * Transforms game data into an autocomplete option.
 * @param obj
 * @returns The autocomplete option data.
 */
function toAutocompleteOption(obj: IGameObject): ApplicationCommandOptionChoice {
  return {
    name: toSentenceCase(obj.Name ?? obj.$id),
    value: obj.$id,
  };
}