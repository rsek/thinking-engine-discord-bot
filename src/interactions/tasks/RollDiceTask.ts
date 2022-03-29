import type { CommandInteraction, MessageComponentInteraction } from "discord.js";
import type { IRollDiceTaskParams } from "../../modules/tasks/ITaskParams.js";
import Roll from "../../modules/rolls/Roll.js";
import Task from "../../modules/tasks/Task.js";
import type GameData from "../../data/GameData.js";

export default class RollDiceTask extends Task<MessageComponentInteraction|CommandInteraction,IRollDiceTaskParams> {
  description?: string | undefined;
  constructor(interaction: MessageComponentInteraction|CommandInteraction, params: IRollDiceTaskParams, gameData: GameData, description?: string | undefined) {
    super(interaction, params, gameData);
    this.description = description;
  }
  run() {
    const dice = this.params.dice;
    const roll = new Roll({ dice, description: this.description });
    return this.interaction.reply(roll.toMessage());
  }
}