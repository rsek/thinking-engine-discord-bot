import "reflect-metadata";

import type { MessageComponentInteraction, CommandInteraction, InteractionReplyOptions } from "discord.js";
import type { IRollTableTaskParams } from "../../modules/tasks/ITaskParams.js";
import userErrorMessage from "../../modules/alerts/userErrorMessage.js";
import { RefType, WidgetType } from "../../modules/widgets/WidgetType.js";
import Task from "../../modules/tasks/Task.js";

export default class RollTableTask extends Task<MessageComponentInteraction | CommandInteraction,IRollTableTaskParams> {
  run() {
    let message: InteractionReplyOptions;
    const tableData = this.gameData[RefType.Table];
    if (!tableData.has(this.params.id)) {
      message = userErrorMessage();
    } else {
      const table = tableData.get(this.params.id);
      message = (table as NonNullable<typeof table>).toMessage(WidgetType.TableRoll);
    }
    return this.interaction.reply(message);
  }
}