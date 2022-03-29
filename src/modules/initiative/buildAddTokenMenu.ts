import { SelectMenuOptionBuilder } from "discord.js";
import { addTokenMenuId, enemyToken, henchmanToken, pcTokenValue } from "./InitiativeConstants.js";
import numberEmoji from "../../constants/numberEmoji.js";
import NumericAttribute from "../attributes/NumericAttribute.js";
import { BotTask } from "../tasks/BotTask.js";
import createTaskMenuStub from "../tasks/createTaskMenuStub.js";
import { packPartialTaskParams } from "../tasks/packTaskParams.js";


export default function buildAddTokenMenu() {
  const menu = createTaskMenuStub(addTokenMenuId)
    .setPlaceholder("Add tokens to initiative...");

  // TODO: if EditAttribute isn't provided with an ID, it should prompt the user for one
  menu.addOptions(
    new SelectMenuOptionBuilder()
      .setLabel("Add player character...")
      .setDescription("Add a new PC with 2 tokens")
      .setEmoji({ name: "👤" })
      .setValue(packPartialTaskParams(BotTask.EditAttribute, { current: pcTokenValue, max: pcTokenValue }) )
  );
  menu.addOptions(
    new NumericAttribute(henchmanToken, 1)
      .toSelectMenuOption({ current: 1, max: 1 })
      .setLabel("Add 1 henchman token")
      .setEmoji({ name: "👥" })
  );
  numberEmoji.slice(1,6).forEach((emoji, index) => {
    const currentValue = index+1;
    menu.addOptions(
      new NumericAttribute(enemyToken, currentValue)
        .toSelectMenuOption({
          current: currentValue,
          max: currentValue
        })
        .setLabel(`Add ${currentValue} enemy ${currentValue > 1 ? "tokens" : "token"}`)
        .setEmoji({ name: emoji as string })
    );
  });
  return menu;
}