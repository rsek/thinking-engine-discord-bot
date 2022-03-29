import { SelectMenuBuilder } from "discord.js";
import { taskMenuIdPrefix } from "../../interactions/components/taskMenuIdPrefix.js";


/**
 * Create a SelectMenuBuilder stub for a bot task menu. Bot task menus embed BotTaskParams in the values of their SelectMenuOptions.
 * @param {string} idSuffix - The suffix of the id of the select menu.
 * @returns A SelectMenuBuilder object.
 */
export default function createTaskMenuStub(idSuffix: string) {
  return new SelectMenuBuilder()
    .setCustomId(`${taskMenuIdPrefix}.${idSuffix}`)
    .setMaxValues(1)
    .setMinValues(1);
}
