import { ButtonInteraction, MessageButton } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import "reflect-metadata";
import gameData from "../../data/gameData.js";
import { botActionRegex, botActionRegexTyped } from "../../functions/parseBotAction.js";

export default function tableRollButton(tableKey: string, label: string = "Roll on table") {
  return new MessageButton()
    .setLabel(label)
    .setEmoji("🎲")
    .setStyle("PRIMARY")
    .setCustomId(`roll-table:${tableKey}`);
}

const tableRollParams = {action: "roll-table", tableKey: "tableKey"};

@Discord()
export abstract class TableRollButton {
  @ButtonComponent(botActionRegex(tableRollParams))
  async rollTable(interaction: ButtonInteraction) {
    // console.log(this);
    const actionData = botActionRegexTyped(tableRollParams).captures(interaction.customId) as typeof tableRollParams;
    if (actionData.tableKey) {
      const table = gameData.tables[actionData.tableKey];
      if (!table) {
        await interaction.reply({content: `Could not find a table with ID: ${actionData.tableKey}`, ephemeral: true});
      } else {
        await interaction.reply(table.toRollMessage());
      }
    }
    return;
  }
}