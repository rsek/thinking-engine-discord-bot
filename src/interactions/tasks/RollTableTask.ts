import "reflect-metadata";
import GameData from "../../data/GameData.js";
import { ButtonBuilder, ButtonStyle, MessageComponentInteraction, CommandInteraction, InteractionReplyOptions } from "discord.js";
import { BotTask } from "../../modules/parseComponent/BotTask.js";
import { packParams } from "../../modules/parseComponent/packParams.js";
import { IRollTableTaskParams } from "../../modules/parseComponent/ITaskParams.js";
import userErrorMessage from "./userErrorMessage.js";
import { RefType, WidgetType } from "../../modules/parseComponent/WidgetType.js";
import Table from "../../modules/tables/Table.js";

export default abstract class RollTableTask {
  // TODO: better method naming?
  static toButton(id: IRollTableTaskParams["id"], label: string = "Roll on table") {
    return new ButtonBuilder()
      .setLabel(label)
      .setEmoji({ name: "🎲" })
      .setStyle(ButtonStyle.Primary)
      .setCustomId(packParams(BotTask.RollTable, { id }) );
  }
  static async exec(interaction: MessageComponentInteraction|CommandInteraction, params: IRollTableTaskParams) {
    const collection = GameData[RefType.Table];
    let message: InteractionReplyOptions;
    if (!collection.has(params.id)) {
      message = userErrorMessage();
    } else {
      const table = collection.get(params.id) as Table;
      message = table.toMessage(WidgetType.TableRoll);
    }
    await interaction.reply(message);
  }
}