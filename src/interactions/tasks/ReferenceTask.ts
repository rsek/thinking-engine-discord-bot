import "reflect-metadata";

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType, InteractionReplyOptions, MessageActionRowComponentBuilder, MessageComponentInteraction } from "discord.js";
import { BotTask } from "../../modules/tasks/BotTask.js";
import { packParams } from "../../modules/tasks/packParams.js";
import { IRefTaskParams, ManageMessageAction } from "../../modules/tasks/ITaskParams.js";
import { RefType, WidgetType } from "../../modules/widgets/WidgetType.js";
import toSentenceCase from "../../modules/text/toSentenceCase.js";
import ManageMessageTask from "./ManageMessageTask.js";
import WidgetOptions from "../../modules/widgets/WidgetOptions.js";
import { container } from "tsyringe";
import IGameObject from "../../modules/inventory/IGameObject.js";
import Backgrounds from "../../data/Backgrounds.js";
import Bestiary from "../../data/Bestiary.js";
import DamageTables from "../../data/DamageTables.js";
import Items from "../../data/Items.js";
import Skills from "../../data/Skills.js";
import Spells from "../../data/Spells.js";
import Tables from "../../data/Tables.js";

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
  // consider: a selectMenu handler that's flagged with the relevant stuff such that its content can be detected via regex and redirected to appropriate handler.
  static async exec(interaction: MessageComponentInteraction | CommandInteraction, params: IRefTaskParams) {
    // TODO: refactor: show item as ephemeral. should also work with slash command
    const collection = ReferenceTask._gameData[params.type];
    let message: WidgetOptions<InteractionReplyOptions> = { };
    if (!collection.has(params.id)) {
      message = { content: `Could not find \`${params.id }\`.`, ephemeral: true };
    } else {
      const item = collection.get(params.id) as IGameObject;
      switch (params.type) {
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
      message.ephemeral = params.ephemeral;
      if (!message.components) {
        message.components = [
          new ActionRowBuilder<ButtonBuilder>()
        ];
      }
      message.components = message.components as ActionRowBuilder<MessageActionRowComponentBuilder>[];

      const targetRowIndex = message.components.findIndex(row => row.toJSON().components.length === 0 || row.toJSON().components.find(item => item.type === ComponentType.Button) && row.toJSON().components.length < 5);
      let buttonToAdd: ButtonBuilder;
      if (params.ephemeral) {
        buttonToAdd = ManageMessageTask.createButton(ManageMessageAction.Reveal);
        message.components[targetRowIndex].addComponents(buttonToAdd);
      }
      // FIXME: dismiss button requires certain message permissions, but i'm not 100% clear on what they are. disabling for now. it may just need to be disabled in DMs, etc

      // else {
      //   buttonToAdd = ManageMessageTask.createButton(ManageMessageAction.Delete);
      // }
      // message.components[targetRowIndex].addComponents(buttonToAdd);
      await interaction.reply(message);
    }
  }
  // static readonly _gameData = container.resolve(GameData);
  static readonly _gameData =   {
    [RefType.Background]: container.resolve(Backgrounds),
    [RefType.Bestiary]: container.resolve(Bestiary),
    [RefType.DamageTable]: container.resolve(DamageTables),
    [RefType.Item]: container.resolve(Items),
    [RefType.Skill]: container.resolve(Skills),
    [RefType.Spell]: container.resolve(Spells),
    [RefType.Table]: container.resolve(Tables),
  };

  // TODO: custom id etc
}