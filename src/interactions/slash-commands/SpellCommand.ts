import { AutocompleteInteraction, ButtonInteraction, CommandInteraction, InteractionReplyOptions, MessageActionRow, MessageButton } from "discord.js";
import { ButtonComponent, Discord, Slash, SlashOption } from "discordx";
import "reflect-metadata";
import gameData from "../../data/gameData.js";
import queryRecord from "../autocomplete/queryRecord.js";
import revealMessageButton from "../components/revealMessageButton.js";

@Discord()
export default abstract class SpellCommand {
  @Slash("spell", {description: "Display the text of a spell."})
  async spell(
    @SlashOption( "spell-name",
      {
        description: "The spell to be displayed",
        type: "STRING",
        autocomplete: true
      })
      spellName: string,
    @SlashOption("ephemeral",
      {
        description: "Whether to display as private ephemeral message, or to the entire channel",
        required: false,
        type: "BOOLEAN"
      }
    )
      ephemeral = true,
    interaction: CommandInteraction|AutocompleteInteraction
  ): Promise<void> {
    switch (interaction.type) {
      case "APPLICATION_COMMAND_AUTOCOMPLETE": {
        interaction = interaction as AutocompleteInteraction;
        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name === "spell-name") {
          return interaction.respond(
            queryRecord(focusedOption.value as string, gameData.spells)
          );
        }
        break;
      }
      case "APPLICATION_COMMAND": {
        interaction = interaction as CommandInteraction;
        const spellData = gameData.spells[spellName];
        if (!spellData) {
          await interaction.reply({
            content:`Couldn't find a spell named ${spellName}.`,
            ephemeral: true});
          return;
        }
        const options: InteractionReplyOptions = {
          embeds: spellData.toEmbeds(),
          ephemeral
        }
        if (ephemeral)
        {

          options.components = [new MessageActionRow({components: [revealMessageButton]})];
        }
        await interaction.reply(options);
        break;
      }
      default:
        break;
    }
  }

}
