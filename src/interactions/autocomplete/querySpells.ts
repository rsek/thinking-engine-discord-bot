import { ApplicationCommandOptionChoice, AutocompleteInteraction, Client } from "discord.js";
import { SlashAutoCompleteOption } from "discordx";
import _ from "lodash";
import gameData from "../../troika/data/gameData.js";

function querySpells(text: string): ApplicationCommandOptionChoice[] {
  let spellNames = Object.keys(gameData.spells).filter(spell => {
    if (spell.toLowerCase().startsWith(text.toLowerCase())) {
      return true;
    }
    return false;
  } );
  let results: ApplicationCommandOptionChoice[] = [];
  if (spellNames.length) {
    results = spellNames.map(spell => {
      return {name: spell, value: spell}
    });
    if (results.length > 25) {
      results = results.slice(0,25);
    }
  }
  return results;
};

export default querySpells;