import "reflect-metadata";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import RollDiceTask from "../tasks/RollDiceTask.js";
import toDiceExpression from "../../modules/rolls/toDiceExpression.js";

@Discord()
export abstract class RollDiceCommand {
  @Slash("dice", {
    description: "Roll generic dice. For d36, d66, and d666, try \"/roll d36\", \"/roll d66\", and \"/roll d666\" instead."
  })
  @SlashGroup("roll")
  async dice(
    @SlashOption("quantity", {
      description: "The number of dice to roll.",
      type: ApplicationCommandOptionType.Integer,
      minValue: 1
    })
      quantity: number,
    @SlashOption("sides", {
      description: "The number of sides each die has.",
      type: ApplicationCommandOptionType.Integer,
      minValue: 2
    })
      sides: number,
    @SlashOption("modifier", {
      description: "An optional modifier to the roll total.",
      type: ApplicationCommandOptionType.Integer,
      required: false
    })
      modifier: number = 0,
    @SlashOption("description", {
      description: "An optional text description.",
      type: ApplicationCommandOptionType.String,
      required: false,
    })
    description: string | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    const dice = toDiceExpression({
      quantity, sides, modifier
    });
    return RollDiceTask.exec(interaction, { dice, description });
  }
}