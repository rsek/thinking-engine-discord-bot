
import { CommandInteraction, MessageComponentInteraction } from "discord.js";
import { IRollPlaceValuesTaskParams } from "../../modules/tasks/ITaskParams.js";
import RollPlaceValues from "../../modules/rolls/RollPlaceValues.js";

export default abstract class RollPlaceValuesTask {
  static async exec(interaction: MessageComponentInteraction|CommandInteraction, params: IRollPlaceValuesTaskParams, description?: string | undefined) {
    const dieType = params.dieType;
    const roll = new RollPlaceValues(dieType, description);
    return interaction.reply(roll.toMessage());
  }
}