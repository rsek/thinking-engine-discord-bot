import "reflect-metadata";
import { AutocompleteInteraction, CommandInteraction, InteractionType, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import GameData from "../../data/gameData.js";
import { RefType } from "../../modules/parseComponent/WidgetType.js";
import queryCollection from "../autocomplete/queryCollection.js";
import ReferenceTask from "../tasks/ReferenceTask.js";

@Discord()
export abstract class BestiaryCommand {
  @Slash("bestiary", { description: "Display a bestiary entry." })
  async bestiary(
    @SlashOption( "enemy-name",
      {
        description: "The enemy to be displayed",
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
        if (focusedOption.name === "enemy-name") {
          return interaction.respond(
            queryCollection(focusedOption.value as string, GameData[RefType.Bestiary])
          );
        }
        break;
      }
      case InteractionType.ApplicationCommand: {
        return ReferenceTask.exec(interaction as CommandInteraction, {
          ephemeral, id, type: RefType.Bestiary
        });
      }
      default:
        throw new Error("[BestiaryCommand] Received unexpected interaction.");
        break;
    }
  }
}
