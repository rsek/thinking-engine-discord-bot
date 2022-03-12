import "reflect-metadata";
import { AutocompleteInteraction, CommandInteraction, InteractionType, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import GameData from "../../data/GameData.js";
import { RefType } from "../../modules/parseComponent/WidgetType.js";
import queryCollection from "../autocomplete/queryCollection.js";
import ReferenceTask from "../tasks/ReferenceTask.js";

@Discord()
export default abstract class SpellCommand {
  @Slash("spell", { description: "Display the text of a spell." })
  static spell(
    @SlashOption( "spell-name",
      {
        description: "The spell to be displayed",
        type: ApplicationCommandOptionType.String,
        autocomplete: true
      })
      id: string,
    @SlashOption("ephemeral",
      {
        description: "Whether to display as private ephemeral message, or to the entire channel",
        required: false,
        type: ApplicationCommandOptionType.Boolean
      }
    )
      ephemeral = true,
    interaction: CommandInteraction|AutocompleteInteraction
  ) {
    switch (interaction.type) {
      case InteractionType.ApplicationCommandAutocomplete: {
        interaction = interaction as AutocompleteInteraction;
        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name === "spell-name") {
          return interaction.respond(
            queryCollection(focusedOption.value as string, GameData[RefType.Spell])
          );
        }
        break;
      }
      case InteractionType.ApplicationCommand: {
        return ReferenceTask.exec(interaction as CommandInteraction, {
          ephemeral, id, type: RefType.Spell
        });
      }
      default:
        throw new Error("[SpellCommand] Received unexpected interaction.");
        break;
    }
  }
}
