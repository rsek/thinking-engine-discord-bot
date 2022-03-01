import { ApplicationCommandOptionChoice } from "discord.js";

export default function queryRecord(text: string, data: Record<string, object|string>): ApplicationCommandOptionChoice[] {
  const itemNames = Object.keys(data).filter(item => {
    if (item.toLowerCase().startsWith(text.toLowerCase())) {
      return true;
    }
    return false;
  } );
  let results: ApplicationCommandOptionChoice[] = [];
  if (itemNames.length) {
    results = itemNames.map(id => {
      return {name: id, value: id}
    });
    if (results.length > 25) {
      results = results.slice(0,25);
    }
  }
  return results;
}