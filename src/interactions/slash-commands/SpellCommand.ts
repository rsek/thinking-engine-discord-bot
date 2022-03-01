import "reflect-metadata";
import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, MetadataStorage, Slash, SlashOption , SlashAutoCompleteOption,SlashOptionAutoCompleteOptions} from "discordx";
import gameData from "../../troika/data/gameData.js";
import querySpells from "../autocomplete/querySpells.js";

@Discord()
export abstract class SpellCommand {
  @Slash("spell", {description: "Display the text of a spell"})
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
      "required": false,
    }
    )
    ephemeral: boolean = true,
    interaction: CommandInteraction|AutocompleteInteraction
  ): Promise<void> {
    // autocomplete will passed to function if not handle above
    switch (interaction.type) {
      case "APPLICATION_COMMAND_AUTOCOMPLETE": {
        interaction = interaction as AutocompleteInteraction;

      const focusedOption = interaction.options.getFocused(true);
      if (focusedOption.name === "spell-name") {
        interaction.respond(
          querySpells(focusedOption.value as string)
        );
      }
        break;
      }
      case "APPLICATION_COMMAND": {
        interaction = interaction as CommandInteraction;
        console.log("spell query:", spellName);
        let spellData = gameData.spells[spellName];

        if (!spellData) {
          await interaction.reply({
            content:`Couldn't find a spell named ${spellName}.`,
            ephemeral: true});
          return;
        }
        await interaction.reply({
          embeds: spellData.toEmbeds(),
          ephemeral
        });
        break;
      }
      default:
        break;
    }

  }
}
