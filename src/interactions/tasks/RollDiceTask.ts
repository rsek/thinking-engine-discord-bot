import { CommandInteraction, MessageComponentInteraction } from "discord.js";
import { IRollDiceTaskParams } from "../../modules/parseComponent/ITaskParams.js";
import Roll from "../../modules/rolls/Roll.js";

export default abstract class RollDiceTask {
  static async exec(interaction: MessageComponentInteraction|CommandInteraction, params: IRollDiceTaskParams, description?: string | undefined) {
    const dice = params.dice;
    const roll = new Roll({ dice, description });
    return interaction.reply(roll.toMessage());
  }
}