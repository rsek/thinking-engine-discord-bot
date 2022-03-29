import "reflect-metadata";

import type { CommandInteraction, InteractionReplyOptions, MessageActionRowComponentBuilder, MessageComponentInteraction } from "discord.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import ManageMessageTask from "./ManageMessageTask.js";
import type IGameObject from "../../modules/inventory/IGameObject.js";
import { BotTask } from "../../modules/tasks/BotTask.js";
import type { IRefTaskParams } from "../../modules/tasks/ITaskParams.js";
import { ManageMessageAction } from "../../modules/tasks/ITaskParams.js";
import { packTaskParams } from "../../modules/tasks/packTaskParams.js";
import Task from "../../modules/tasks/Task.js";
import toSentenceCase from "../../modules/text/toSentenceCase.js";
import type WidgetOptions from "../../modules/widgets/WidgetOptions.js";
import { RefType, WidgetType } from "../../modules/widgets/WidgetType.js";

interface IReferenceable {
  $id: string,
  name?: string,
  Name?: string,
  Type: RefType,
}

export default class ReferenceTask extends Task<MessageComponentInteraction | CommandInteraction,IRefTaskParams> {
  static createButton(target: IReferenceable, ephemeral: boolean) {
    const params: IRefTaskParams = {
      id: target.$id, type: target.Type, ephemeral
    };
    return new ButtonBuilder()
      .setCustomId(packTaskParams(BotTask.Reference, params))
      .setLabel(toSentenceCase(target.Name ?? target.name ?? target.$id))
      .setEmoji({ name: "ℹ️" })
      .setStyle(ButtonStyle.Secondary)
    ;
  }
  run() {
    // TODO: refactor: show item as ephemeral. should also work with slash command
    const collection = this.gameData[this.params.type];
    let message: WidgetOptions<InteractionReplyOptions> = { };
    if (!collection.has(this.params.id)) {
      message = { content: `Could not find \`${this.params.id }\`.`, ephemeral: true };
    } else {
      const item = collection.get(this.params.id) as IGameObject;
      switch (this.params.type) {
        // case RefType.Background:
        //   break;
        case RefType.Bestiary:
          message = item.toMessage();
          break;
        case RefType.DamageTable:
          message = item.toMessage(WidgetType.DamageTable);
          break;
        case RefType.Item:
          message = item.toMessage();
          break;
        // case RefType.Skill:
        //   break;
        case RefType.Table:
          message = item.toMessage(WidgetType.Table);
          break;
        case RefType.Spell:
          message = item.toMessage(WidgetType.Spell);
          break;
        default:
          throw new RangeError();
          break;
      }
      message.ephemeral = this.params.ephemeral;
      if (!message.components) {
        message.components = [
          new ActionRowBuilder<ButtonBuilder>()
        ];
      }
      message.components = message.components as ActionRowBuilder<MessageActionRowComponentBuilder>[];

      const targetRowIndex = message.components.findIndex(row => row.toJSON().components.length === 0 || row.toJSON().components.find(item => item.type === ComponentType.Button) && row.toJSON().components.length < 5);
      let buttonToAdd: ButtonBuilder;
      if (this.params.ephemeral) {
        buttonToAdd = ManageMessageTask.createButton(ManageMessageAction.Reveal);
        message.components[targetRowIndex].addComponents(buttonToAdd);
      }

      // FIXME: smart assignment of dismiss button based on whether interaction is in guild

      // else {
      //   buttonToAdd = ManageMessageTask.createButton(ManageMessageAction.Delete);
      // }
      // message.components[targetRowIndex].addComponents(buttonToAdd);
    }

    return this.interaction.reply(message);
  }
}