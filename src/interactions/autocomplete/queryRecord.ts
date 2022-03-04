import { ApplicationCommandOptionChoice } from "discord.js";

export default function queryRecord(query: string, data: Record<string, object|string>): ApplicationCommandOptionChoice[] {
  let itemNames;
  if (query.length) {
    itemNames = Object.keys(data).filter(item => {
      if (item.toLowerCase().startsWith(query.toLowerCase())) {
        return true;
      }
      return false;
    } );
  } else {
    itemNames = Object.keys(data);
  }
  // console.log("itemNames", itemNames);
  let results: ApplicationCommandOptionChoice[] = [];
  if (itemNames.length) {
    results = itemNames.map(id => {
      return {name: id, value: id}
    });
    if (results.length > 25) {
      results = results.slice(0,25);
    }
  }
  // console.log("results:", results);
  return results;
}