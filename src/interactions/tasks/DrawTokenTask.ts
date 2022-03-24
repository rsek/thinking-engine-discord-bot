import "reflect-metadata";
import { ButtonBuilder, ButtonStyle, Embed, EmbedBuilder, MessageComponentInteraction } from "discord.js";
import { BotTask } from "../../modules/parseComponent/BotTask.js";
import { TokenStackAction } from "../../modules/parseComponent/ITaskParams.js";
import { packParams } from "../../modules/parseComponent/packParams.js";
import { firstEmbedOfType } from "../../modules/ux/firstEmbedOfType.js";
import userErrorMessage from "./userErrorMessage.js";
import InitiativeStack from "../../modules/initiative/InitiativeStack.js";
import { endOfRoundToken, enemyToken } from "../../modules/initiative/initiativeTokens.js";
import { WidgetType } from "../../modules/parseComponent/WidgetType.js";
import ColorTheme from "../../constants/ColorTheme.js";
import { APIEmbed } from "discord-api-types/v10";


export default abstract class DrawTokenTask {
  static get taskParams() {
    return packParams(BotTask.InitiativeToken, { action: TokenStackAction.Draw });
  }
  static createButton() {
    const button = new ButtonBuilder()
      .setCustomId(DrawTokenTask.taskParams)
      .setLabel("Draw token")
      .setStyle(ButtonStyle.Primary)
      ;
    return button;
  }
  // TODO: move to router, pass interaction + params there instead? or leave as is? hmm
  // @Button(taskParams)
  static drawTokenAlertEmbed(token: string, turn: number, round: number) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Initiative Token" })
      ;
    if (token === endOfRoundToken) {
      embed.setTitle(token);
      embed.setDescription(`Round ${round} ends.`);
      embed.setFooter({
        text: "Remove Tokens contributed by dead characters and enemies, resolve any per Round or end of Round activities such as magic effects, Drowning, fire, poison, or bleeding, then draw another Token and carry on."
      });
      // TODO: consider ways to signal this as complete.
      // can any interactives be removed after a single use?
      // this could be generalized to a property representing, like, uses remaining.
      // every time the interaction successfully fires, it's decremented.
      // then a single function can clear all buttons where the key equals zero?
      // maybe it's a top level key with no particular object, like {count: 5}. a more complex version could specify what to fire, but i'm not sure how much space there is
    } else {
      embed.setTitle(`Turn ${turn}: ${token}`);
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
  static async drawToken(interaction: MessageComponentInteraction) {
    const embeds = interaction.message.embeds as APIEmbed[];
    const embed = firstEmbedOfType(WidgetType.InitiativeStack, embeds);
    if (!embed) {
      await interaction.reply(userErrorMessage());
    } else {
      const draw = InitiativeStack.fromEmbed(embed).drawToken();
      const token = draw.token;
      const stack = draw.stack;
      const embeds = [DrawTokenTask.drawTokenAlertEmbed(token, stack.turn, stack.round)];
      const widget = stack.toMessage();
      const message = {
        embeds: widget.embeds.map(embed => embed.toJSON()),
        components: widget.components.map(components => components.toJSON())
      };
      await interaction.update(message);
      await interaction.followUp({ embeds });
    }
  }
}