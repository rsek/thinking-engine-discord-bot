import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, InteractionReplyOptions, MessageComponentInteraction } from "discord.js";
import GameData from "../../data/gameData.js";
import { BotTask } from "../../modules/parseComponent/BotTask.js";
import { packParams } from "../../modules/parseComponent/packParams.js";
import { IRefTaskParams, ManageMessageAction } from "../../modules/parseComponent/ITaskParams.js";
import { RefType, WidgetType } from "../../modules/parseComponent/WidgetType.js";
import Table from "../../modules/tables/Table.js";
import Spell from "../../modules/items/Spell.js";
import DamageInfo from "../../modules/DamageRoll/DamageInfo.js";
import Item from "../../modules/inventory/Item.js";
import toSentenceCase from "../../modules/text/toSentenceCase.js";
import ManageMessageTask from "./ManageMessageTask.js";

interface IReferenceable {
  $id: string,
  name?: string,
  Name?: string,
  Type: RefType,
}

export default abstract class ReferenceTask {
  static createButton(target: IReferenceable, ephemeral: boolean) {
    const params: IRefTaskParams = {
      id: target.$id, type: target.Type, ephemeral
    };
    return new ButtonBuilder()
      .setCustomId(packParams(BotTask.Reference, params))
      .setLabel(toSentenceCase(target.Name ?? target.name ?? target.$id))
      .setEmoji({ name: "ℹ️" })
      .setStyle(ButtonStyle.Secondary)
    ;
  }
  // TODO: custom id etc
  // consider: a selectMenu handler that's flagged with the relevant stuff such that its content can be detected via regex and redirected to appropriate handler.
  static async exec(interaction: MessageComponentInteraction | CommandInteraction, params: IRefTaskParams) {
    // TODO: refactor: show item as ephemeral. should also work with slash command
    const collection = GameData[params.type];
    let message: InteractionReplyOptions = { };
    if (!collection.has(params.id)) {
      message = { content: `Could not find \`${params.id }\` in \`\``, ephemeral: true };
    } else {
      const item = collection.get(params.id);
      switch (params.type) {
        case RefType.DamageTable:
          message = (item as DamageInfo).toMessage(WidgetType.DamageTable, params.ephemeral);
          break;
        // case RefType.Background:
        //   break;
        case RefType.Item:
          message = (item as Item).toMessage();
          message.ephemeral = params.ephemeral;
          break;
        // case RefType.Skill:
        //   break;
        case RefType.Table:
          message = (item as Table).toMessage(WidgetType.Table, params.ephemeral);
          break;
        case RefType.Spell:
          message = (item as Spell).toMessage(WidgetType.Spell, params.ephemeral);
          break;
        default:
          throw new RangeError();
          break;
      }
      if (!message.components) {
        message.components = [];
      }
      if (params.ephemeral) {
        message.components.push(
          new ActionRowBuilder<ButtonBuilder>().addComponents(ManageMessageTask.createButton(ManageMessageAction.Reveal)
          ));
      } else {
        message.components.push(new ActionRowBuilder<ButtonBuilder>().addComponents(ManageMessageTask.createButton(ManageMessageAction.Delete)));
      }
      await interaction.reply(message);
    }
  }
}