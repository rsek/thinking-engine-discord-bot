import "reflect-metadata";
import { Discord, Slash, SlashOption } from "discordx";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import InitiativeStack from "../../modules/initiative/InitiativeStack.js";
import _ from "lodash";
import { enemyToken, henchmanToken } from "../../modules/initiative/initiativeTokens.js";
import { pcTokenValue } from "../../modules/initiative/initiativeTokens.js";

@Discord()
export default abstract class InitiativeCommand {
  @Slash("initiative", {
    description: "Create an interactive initiative token stack."
  })
  async initiative(
    @SlashOption("title", {
      description: "A title for the tracker.",
      type: ApplicationCommandOptionType.String
    })
      title: string,
    @SlashOption("enemy-tokens", {
      description: "The number of enemy tokens.",
      type: ApplicationCommandOptionType.Integer,
      minValue: 1
    })
      enemyTokens: number,
    @SlashOption("character1", {
      type: ApplicationCommandOptionType.String,
      description: "The name of the first player character. Additional PCs may be added as optional parameters."
    })
      character1: string,
    @SlashOption("character2", {
      type: ApplicationCommandOptionType.String,
      required: false,
      description: "The name of an additional player character."
    })
      character2: string = "",
    @SlashOption("character3", {
      type: ApplicationCommandOptionType.String,
      required: false,
      description: "The name of an additional player character."
    })
    character3: string = "",
    @SlashOption("character4", {
      type: ApplicationCommandOptionType.String,
      required: false,
      description: "The name of an additional player character."
    })
    character4: string = "",
    @SlashOption("character5", {
      type: ApplicationCommandOptionType.String,
      required: false,
      description: "The name of an additional player character."
    })
    character5: string = "",
    @SlashOption("character6", {
      type: ApplicationCommandOptionType.String,
      required: false,
      description: "The name of an additional player character."
    })
    character6: string = "",
    @SlashOption("character7", {
      type: ApplicationCommandOptionType.String,
      required: false,
      description: "The name of an additional player character."
    })
    character7: string = "",
    @SlashOption("character8", {
      type: ApplicationCommandOptionType.String,
      required: false,
      description: "The name of an additional player character."
    })
    character8: string = "",
    @SlashOption("henchman-tokens", {
      description: "The number of henchman tokens. Default: 0.",
      type: ApplicationCommandOptionType.Integer,
      minValue: 0,
      required: false
    })
    henchmanTokens: number = 0,
    interaction: CommandInteraction
  ): Promise<void> {
    const initiative = new InitiativeStack(title);
    const characters = _.compact([ character1, character2, character3, character4, character5, character6, character7, character8 ]);
    characters.forEach(character => initiative.addToken(character, pcTokenValue));
    if (henchmanTokens > 0) {
      initiative.addToken(henchmanToken, henchmanTokens);
    }
    initiative.addToken(enemyToken, enemyTokens);
    // end of round is added by constructor
    return interaction.reply(initiative.toMessage());
  }
}