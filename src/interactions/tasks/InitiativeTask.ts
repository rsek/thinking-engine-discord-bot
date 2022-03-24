import "reflect-metadata";
import { ButtonBuilder, ButtonStyle, EmbedBuilder, MessageComponentInteraction } from "discord.js";
import { BotTask } from "../../modules/parseComponent/BotTask.js";
import { IInitiativeTokenTaskParams, InitiativeAction } from "../../modules/parseComponent/ITaskParams.js";
import { packParams } from "../../modules/parseComponent/packParams.js";
import { firstEmbedOfType } from "../../modules/ux/firstEmbedOfType.js";
import userErrorMessage from "./userErrorMessage.js";
import InitiativeStack from "../../modules/initiative/InitiativeStack.js";
import { endOfRoundToken, enemyToken } from "../../modules/initiative/initiativeTokens.js";
import { WidgetType } from "../../modules/parseComponent/WidgetType.js";
import ColorTheme from "../../constants/ColorTheme.js";
import { APIEmbed } from "discord-api-types/v10";
import { roundPrefix, turnPrefix } from "../../modules/initiative/InitiativeDisplay.js";

export default abstract class InitiativeTask {
  static taskParams<T extends InitiativeAction>(tokenStackAction: T) {
    return packParams(BotTask.Initiative, { action: tokenStackAction });
  }
  static createButton<T extends InitiativeAction>(tokenStackAction: T) {
    const button = new ButtonBuilder()
      .setCustomId(InitiativeTask.taskParams(tokenStackAction))
      ;
    switch (tokenStackAction) {
      case InitiativeAction.Draw:
        button
          .setLabel("Draw token")
          .setStyle(ButtonStyle.Primary);
        break;
      case InitiativeAction.Shuffle:
        button
          .setLabel("Return all tokens and shuffle")
          .setStyle(ButtonStyle.Danger);
        break;
      default:
        break;
    }
    return button;
  }
  static roundString(turn: number, round: number) {
    return `${roundPrefix}${round.toString()}, ${turnPrefix}${turn.toString()}`;
  }
  static drawAlertEmbed(token: string, turn: number, round: number) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Initiative Token" })
      .setFooter({ text: this.roundString(turn, round) })
      .setTitle(token)
      ;
    if (token === endOfRoundToken) {
      embed.setDescription(`Round ${round} ends. All tokens have been returned to the stack.`);
      embed.setFooter({
        text: "Remove Tokens contributed by dead characters and enemies, resolve any per Round or end of Round activities such as magic effects, Drowning, fire, poison, or bleeding, then draw another Token and carry on."
      });
      // TODO: consider ways to signal this as complete.
      // can any interactives be removed after a single use?
      // this could be generalized to a property representing, like, uses remaining.
      // every time the interaction successfully fires, it's decremented.
      // then a single function can clear all buttons where the key equals zero?
      // maybe it's a top level key with no particular object, like {count: 5}. a more complex version could specify what to fire, but i'm not sure how much space there is
    }
    switch (token) {
      case enemyToken:
        embed.setColor(ColorTheme.Danger);
        break;
      case endOfRoundToken:
        embed.setColor(ColorTheme.Secondary);
        break;
      default:
        embed.setColor(ColorTheme.Primary);
        break;
    }
    return embed;
  }
  static async exec(interaction: MessageComponentInteraction, task: IInitiativeTokenTaskParams) {
    const embeds = interaction.message.embeds as APIEmbed[];
    const embed = firstEmbedOfType(WidgetType.InitiativeStack, embeds);
    if (!embed) {
      return interaction.reply(userErrorMessage());
    }
    switch (task.action) {
      case InitiativeAction.Draw:
        return InitiativeTask.draw(interaction, embed);
        break;
      case InitiativeAction.Shuffle:
        return InitiativeTask.shuffle(interaction, embed);
        break;
      default:
        await interaction.reply(userErrorMessage());
        break;
    }
  }
  static async shuffle(interaction: MessageComponentInteraction, embed: APIEmbed) {
    const stack = InitiativeStack.fromEmbed(embed).shuffleTokens();
    const widget = stack.toMessage();
    // TODO: toJSON shouldn't need to happen; as far as i can tell it's a bug in discord.js
    // either patch it to fix, or await the commit
    const message = {
      embeds: widget.embeds.map(embed => embed.toJSON()),
      components: widget.components.map(components => components.toJSON())
    };
    return interaction.update(message);
  }
  static async draw(interaction: MessageComponentInteraction, embed: APIEmbed) {
    const draw = InitiativeStack.fromEmbed(embed).drawToken();
    const token = draw.token;
    const stack = draw.stack;
    const embeds = [InitiativeTask.drawAlertEmbed(token, stack.turn, stack.round)];
    const widget = stack.toMessage();
    const message = {
      embeds: widget.embeds.map(embed => embed.toJSON()),
      components: widget.components.map(components => components.toJSON())
    };
    await interaction.update(message);
    return interaction.followUp({ embeds });
  }
}