import { MessageSelectMenu, MessageSelectOptionData } from "discord.js";
import { incrementFieldId } from "../../functions/incrementField.js";
import { paramSeparator } from "../../functions/parseBotAction.js";
import { currentKeyName } from "./currentMax.js";
import { enemyToken, henchmanToken } from "./initiativeTokens.js";
import numberEmoji from "./numberEmoji.js";

export const addTokenMenuId = "addTokenMenu";

export default function buildAddTokenMenu() {
  const removeTokenMenu = new MessageSelectMenu()
    .setCustomId(addTokenMenuId)
    .setPlaceholder("Add tokens...")
    .setMaxValues(1)
    .setMinValues(1)
  ;
  const tokenOptions: MessageSelectOptionData[] = [
    {
      default: false,
      label: "Add 1 henchman token",
      value: `${incrementFieldId}:1${paramSeparator}1${paramSeparator}${henchmanToken}`,
      emoji: "👥"
    }
  ];

  numberEmoji.slice(1,5).forEach((emoji,index) => {
    const currentValue = index+1;
    tokenOptions.push({
      default: false,
      label: `Add ${currentValue} enemy ${currentValue > 1 ? "tokens" : "token"}`,
      // NB: adds one to both max and current to replicate drawing/stacking behaviour. in other words: the number of *drawn* tokens remains the same, but the *total* tokens changes.
      value: `${incrementFieldId}:${currentValue}${paramSeparator}${currentValue}${paramSeparator}${enemyToken}`,
      emoji
    });

  });
  removeTokenMenu.addOptions(...tokenOptions);
  return removeTokenMenu;
}