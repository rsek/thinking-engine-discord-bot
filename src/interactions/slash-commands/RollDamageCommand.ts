import { CommandInteraction, AutocompleteInteraction } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import Armour from "../../troika/constants/Armour.js";
import gameData from "../../troika/data/gameData.js";
import queryRecord from "../autocomplete/queryRecord.js";

@Discord()
export default abstract class RollDamageCommand {
  @Slash("damage", {description: "Roll damage."})
  @SlashGroup("roll")
  async rollTable(
    @SlashOption( "weapon-name",
      {
        description: "The spell or weapon damage to use.",
        type: "STRING",
        autocomplete: true
      })
      weaponName: string,
    @SlashOption("armour", {
      description: "The armour of the target.",
      type: "STRING"
    })
      armour: Armour,
      interaction: CommandInteraction|AutocompleteInteraction
  ): Promise<void> {
    switch (interaction.type) {
      case "APPLICATION_COMMAND_AUTOCOMPLETE": {
        interaction = interaction as AutocompleteInteraction;
        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name === "weapon-name") {
          return interaction.respond(
            queryRecord(focusedOption.value as string, gameData.weapons)
          );
        }
        break;
      }
      case "APPLICATION_COMMAND": {
        interaction = interaction as CommandInteraction;
        const tableData = gameData.weapons[weaponName];
        if (!tableData) {
          await interaction.reply({
            content:`Couldn't find a weapon or spell named ${weaponName}.`,
            ephemeral: true});
          return;
        }
        await interaction.reply({
          embeds: [],
        });
        break;
      }
      default:
        break;
    }
  }
}