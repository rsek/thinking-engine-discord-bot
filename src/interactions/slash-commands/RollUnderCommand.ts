import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup , SlashOption } from "discordx";
import { Bot } from "../../bot.js";
import RollUnderTask from "../tasks/RollUnderTask.js";

@Discord()
export default class RollUnderCommand {
  @Slash("under", { description: "Make a roll to score equal to or under a target number" })
  @SlashGroup("roll")
  async under(
    @SlashOption("target-number", {
      type: ApplicationCommandOptionType.Number,
      minValue: 0
    })
      targetNumber: number,
    @SlashOption("description", {
      type: ApplicationCommandOptionType.String,
      description: "An optional text description to include with the roll.",
      required: false
    })
      description = "",
    interaction: CommandInteraction
  ): Promise<void> {
    return new RollUnderTask(interaction, { target: targetNumber }, Bot.gameData, description).run();
  }
}