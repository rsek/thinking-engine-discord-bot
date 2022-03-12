import { ButtonComponent, ButtonStyle } from "discord.js";
import { Button } from "discordx";
import _ from "lodash-es";
import { BotTask } from "../parseComponent/BotTask.js";
import { packParams } from "../parseComponent/packParams.js";
import { dicePattern } from "./diceExpression.js";
import toDiceExpression from "./toDiceExpression.js";
/**
 * Extracts any roll notation from descriptive text, and generates buttons for those rolls.
 *
 * @export
 * @param {string} text
 * @return {*}  {ButtonComponent[]}
 */
export default function extractRollButtons(text: string): ButtonComponent[] {
  const captures = dicePattern.captureAll(text);
  const buttons = captures.map(capture => {
    const numberCapture = _.mapValues(capture, (value) => Number(value));
    const dice = toDiceExpression(numberCapture);
    const customId = packParams(BotTask.RollDice, { dice });
    const button = new ButtonComponent()
      .setCustomId(customId)
      .setStyle(ButtonStyle.Primary)
      .setLabel(`Roll ${dice}`)
      .setEmoji({ name: "🎲" })
      ;
    return button;
  });
  return buttons;
}