import type { CommandInteraction, MessageComponentInteraction } from "discord.js";
import type GameData from "../../data/GameData.js";
import RollUnder from "../../modules/rolls/RollUnder.js";
import type { BotTask } from "../../modules/tasks/BotTask.js";
import BotTaskBase from "../../modules/tasks/BotTaskBase.js";
import type { IRollUnderTaskParams } from "../../modules/tasks/ITaskParams.js";

export default class RollUnderTask extends BotTaskBase<MessageComponentInteraction | CommandInteraction, BotTask.RollUnder> {
  description?: string | undefined;
  constructor(
    interaction: MessageComponentInteraction|CommandInteraction,
    params: IRollUnderTaskParams,
    gameData: GameData,
    description?: string | undefined
  ) {
    super(interaction, params, gameData);
    this.description = description?.length ? description : undefined;
  }
  run() {
    const roll = new RollUnder({ params: { target: this.params.target }, description: this.description });
    return this.interaction.reply(roll.toMessage());
  }
}