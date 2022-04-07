import type { CommandInteraction, Message, MessageComponentInteraction } from "discord.js";
import type { BotTask } from "../../modules/tasks/BotTask.js";
import BotTaskBase from "../../modules/tasks/BotTaskBase.js";
// FIXME

export default class RollDamageTask extends BotTaskBase<MessageComponentInteraction | CommandInteraction, BotTask.RollDamage> {
  run(): Promise<void> | Promise<Message<boolean>> {
    throw new Error("Method not implemented.");
  }
}