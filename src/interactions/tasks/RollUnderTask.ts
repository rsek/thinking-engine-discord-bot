import type { CommandInteraction, MessageComponentInteraction } from "discord.js";
import type GameData from "../../data/GameData.js";
import RollUnder from "../../modules/rolls/RollUnder.js";
import type { IRollUnderTaskParams } from "../../modules/tasks/ITaskParams.js";
import Task from "../../modules/tasks/Task.js";

export default class RollUnderTask extends Task<MessageComponentInteraction | CommandInteraction, IRollUnderTaskParams> {
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
    const roll = new RollUnder(this.params.target, this.description);
    return this.interaction.reply(roll.toMessage());
  }
}