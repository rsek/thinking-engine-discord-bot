import "reflect-metadata";
import { Discord, Slash, SlashGroup, SlashOption} from "discordx";
import { CommandInteraction } from "discord.js";
import Roll from "../../classes/Roll.js";

@Discord()
export default abstract class RollDiceCommand {
  @Slash("dice", {description: "Roll generic dice. For d66, use '/roll d66' instead."})
  @SlashGroup("roll")
  async dice(
    @SlashOption("quantity", {
      description: "The number of dice to roll.",
      type: "INTEGER",
      minValue: 1})
      quantity: number,
    @SlashOption("sides", {
      description: "The number of sides each die has.",
      type: "INTEGER",
      minValue: 2
    })
      sides: number,
    @SlashOption("modifier", {
      description: "An optional modifier to the roll total.",
      type: "INTEGER",
      required: false
    })
      modifier: number = 0,
    interaction: CommandInteraction
  ): Promise<void> {
    const roll = new Roll(quantity, sides, modifier);
    await interaction.reply({embeds: [roll.toEmbed()]});
  }
}