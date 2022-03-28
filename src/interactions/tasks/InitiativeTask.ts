
import { EmbedBuilder, MessageComponentInteraction } from "discord.js";
import { IInitiativeTokenTaskParams, InitiativeAction } from "../../modules/tasks/ITaskParams.js";
import { firstEmbedOfType } from "../../utils/firstEmbedOfType.js";
import userErrorMessage from "../../modules/alerts/userErrorMessage.js";
import InitiativeStack from "../../modules/initiative/InitiativeStack.js";
import { WidgetType } from "../../modules/widgets/WidgetType.js";
import ColorTheme from "../../constants/ColorTheme.js";
import { APIEmbed } from "discord-api-types/v10";
import { endOfRoundToken, enemyToken } from "../../modules/initiative/InitiativeConstants.js";

export default abstract class InitiativeTask {
  static drawAlertEmbed(token: string, turn: number, round: number) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Initiative Token" })
      .setFooter({ text: InitiativeStack.roundString(turn, round) })
      .setTitle(token)
      ;
    if (token === endOfRoundToken) {
      embed.setDescription(`Round ${round} ends. All tokens have been returned to the stack.`);
      embed.setFooter({
        text: "Remove Tokens contributed by dead characters and enemies, resolve any per Round or end of Round activities such as magic effects, Drowning, fire, poison, or bleeding, then draw another Token and carry on."
      });
      // TODO: consider ways to signal this as complete.
      // can any interactive components be removed after a single use?
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