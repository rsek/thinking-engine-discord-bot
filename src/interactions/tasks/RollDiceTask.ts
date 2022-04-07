import type { APIEmbed } from "discord-api-types/v10";
import type { CommandInteraction, MessageComponentInteraction } from "discord.js";
import { InteractionType } from "discord.js";
import type GameData from "../../data/GameData.js";
import RollDice from "../../modules/rolls/RollDice.js";
import type { BotTask } from "../../modules/tasks/BotTask.js";
import BotTaskBase from "../../modules/tasks/BotTaskBase.js";
import type { IRollDiceTaskParams } from "../../modules/tasks/ITaskParams.js";
import { WidgetType } from "../../modules/widgets/WidgetType.js";
import { firstEmbedOfType } from "../../utils/firstEmbedOfType.js";

export default class RollDiceTask extends BotTaskBase<MessageComponentInteraction|CommandInteraction,BotTask.RollDice> {
  description?: string | undefined;
  constructor(interaction: MessageComponentInteraction|CommandInteraction, params: IRollDiceTaskParams, gameData: GameData, description?: string | undefined) {
    super(interaction, params, gameData);
    if (this.params.isReroll && this.interaction.type === InteractionType.MessageComponent) {
      const oldEmbed = firstEmbedOfType(WidgetType.RollDice, (this.interaction as MessageComponentInteraction).message.embeds as APIEmbed[]);
      this.description = oldEmbed?.description;
    } else {
      this.description = description;
    }
  }
  run() {
    const { dice } = this.params;
    const roll = new RollDice({ dice, description: this.description });
    return this.interaction.reply(roll.toMessage());
  }
}