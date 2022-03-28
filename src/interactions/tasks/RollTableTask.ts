import "reflect-metadata";

import { ButtonBuilder, ButtonStyle, MessageComponentInteraction, CommandInteraction, InteractionReplyOptions } from "discord.js";
import { BotTask } from "../../modules/tasks/BotTask.js";
import { packParams } from "../../modules/tasks/packParams.js";
import { IRollTableTaskParams } from "../../modules/tasks/ITaskParams.js";
import userErrorMessage from "../../modules/alerts/userErrorMessage.js";
import { WidgetType } from "../../modules/widgets/WidgetType.js";
import Table from "../../modules/tables/Table.js";
import { container } from "tsyringe";
import Tables from "../../data/Tables.js";

export default abstract class RollTableTask {
  static toButton(id: IRollTableTaskParams["id"], label: string = "Roll on table") {
    return new ButtonBuilder()
      .setLabel(label)
      .setEmoji({ name: "🎲" })
      .setStyle(ButtonStyle.Primary)
      .setCustomId(packParams(BotTask.RollTable, { id }) );
  }
  static async exec(interaction: MessageComponentInteraction|CommandInteraction, params: IRollTableTaskParams) {
    const collection = RollTableTask._gameData;
    let message: InteractionReplyOptions;
    if (!collection.has(params.id)) {
      message = userErrorMessage();
    } else {
      const table = collection.get(params.id) as Table;
      message = table.toMessage(WidgetType.TableRoll);
    }
    await interaction.reply(message);
  }
  static readonly _gameData = container.resolve(Tables);
}