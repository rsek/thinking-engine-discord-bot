import "reflect-metadata";

import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, InteractionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { RefType } from "../../modules/widgets/WidgetType.js";
import queryCollection from "../autocomplete/queryCollection.js";
import ReferenceTask from "../tasks/ReferenceTask.js";
import { Bot } from "../../bot.js";

@Discord()
export abstract class SpellCommand {
  @Slash("spell", { description: "Display the text of a spell." })
  async spell(
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
    interaction: CommandInteraction |AutocompleteInteraction
  ) {
    switch (interaction.type) {
      case InteractionType.ApplicationCommandAutocomplete: {
        interaction = interaction as AutocompleteInteraction;
        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name === "spell-name") {
          return interaction.respond(
            queryCollection(focusedOption.value as string, Bot.gameData[RefType.Spell])
          );
        }
        break;
      }
      case InteractionType.ApplicationCommand: {
        return new ReferenceTask(interaction as CommandInteraction, {
          ephemeral, id, type: RefType.Spell
        }, Bot.gameData).run();
      }
      default:
        throw new Error("[SpellCommand] Received unexpected interaction.");
        break;
    }
  }
}
