import "reflect-metadata";
import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption , SlashGroup} from "discordx";
import RollUnder from "../../classes/RollUnder.js";

@Discord()
export default class RollUnderCommand {
  @Slash("under", {
    description: "Make a roll to score equal to or under a target number"})
  @SlashGroup("roll")
  async under(
    @SlashOption("target-number", {
      type: "NUMBER",
      minValue: 0})
      targetNumber: number,
    @SlashOption("description", {
      type: "STRING",
      description: "An optional text description to include with the roll.",
      required: false
    })
      description = "",
    interaction: CommandInteraction
  ): Promise<void> {
    const roll = new RollUnder(targetNumber,description.length ? description : undefined);
    await interaction.reply({embeds: [roll.toEmbed()]});
  }
}