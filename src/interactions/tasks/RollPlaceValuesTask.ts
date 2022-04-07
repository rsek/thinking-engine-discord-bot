
import type { CommandInteraction, MessageComponentInteraction } from "discord.js";
import type GameData from "../../data/GameData.js";
import RollPlaceValues from "../../modules/rolls/RollPlaceValues.js";
import type { BotTask } from "../../modules/tasks/BotTask.js";
import BotTaskBase from "../../modules/tasks/BotTaskBase.js";
import type { IRollPlaceValuesTaskParams } from "../../modules/tasks/ITaskParams.js";

export default class RollPlaceValuesTask extends BotTaskBase<MessageComponentInteraction|CommandInteraction, BotTask.RollPlaceValues> {
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
    const roll = new RollPlaceValues(this.params, this.description);
    return this.interaction.reply(roll.toMessage());
  }
}