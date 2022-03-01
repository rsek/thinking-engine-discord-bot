import "reflect-metadata";
import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, MetadataStorage, Slash, SlashOption , SlashAutoCompleteOption,SlashOptionAutoCompleteOptions} from "discordx";
import gameData from "../../troika/data/gameData.js";
import querySpells from "../autocomplete/querySpells.js";
import _ from "lodash";

@Discord()
export abstract class SpellCommand {
  @Slash("d66", {description: "Roll a d66"})
  async d66(
    interaction: CommandInteraction
  ): Promise<void> {
    interaction = interaction as CommandInteraction;
    let die1 = _.random(1,6);
    let die2 = _.random(1,6);
    await interaction.reply(`d66 roll: **${die1}${die2}**`);
  }
}
