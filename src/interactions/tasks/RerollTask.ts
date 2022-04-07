import type { Message, MessageComponentInteraction } from "discord.js";
import type { BotTask } from "../../modules/tasks/BotTask.js";
import BotTaskBase from "../../modules/tasks/BotTaskBase.js";
// FIXME
// extract roll params from embed of type.
export default class RerollTask extends BotTaskBase<MessageComponentInteraction, BotTask.Reroll> {
  run(): Promise<void> | Promise<Message<boolean>> {
    throw new Error("Method not implemented.");
  }
}