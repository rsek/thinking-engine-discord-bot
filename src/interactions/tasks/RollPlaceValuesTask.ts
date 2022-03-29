
import type { CommandInteraction, MessageComponentInteraction } from "discord.js";
import type GameData from "../../data/GameData.js";
import RollPlaceValues from "../../modules/rolls/RollPlaceValues.js";
import type { IRollPlaceValuesTaskParams } from "../../modules/tasks/ITaskParams.js";
import Task from "../../modules/tasks/Task.js";

export default class RollPlaceValuesTask extends Task<MessageComponentInteraction|CommandInteraction, IRollPlaceValuesTaskParams> {
  description?: string | undefined;
  constructor(
    interaction: MessageComponentInteraction|CommandInteraction,
    params: IRollPlaceValuesTaskParams,
    gameData: GameData,
    description?: string | undefined) {
    super(interaction, params, gameData);
    this.description = description;
  }
  run(): Promise<void> {
    const dieType = this.params.dieType;
    const roll = new RollPlaceValues(dieType, this.description);
    return this.interaction.reply(roll.toMessage());
  }
}