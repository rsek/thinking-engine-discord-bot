import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { Bot } from "../../bot.js";
import RollPlaceValuesTask from "../tasks/RollPlaceValuesTask.js";

@Discord()
export abstract class RollPlaceValuesCommands {
  @Slash("d36", {
    description: "Roll a d36 (1d3×10 + 1d6). For standard dice, use \"/roll dice\"; for tables, use \"/table\"."
  })
  @SlashGroup("roll")
  async d36(
    @SlashOption("description", {
      description: "An optional description.",
      required: false,
    })
    description: string = "",
    interaction: CommandInteraction
  ): Promise<void> {
    const dieType = 36;
    return new RollPlaceValuesTask(interaction, { dieType }, Bot.gameData, description).run();
  }
  @Slash("d66", {
    description: "Roll a d66 (1d6×10 + 1d6). For standard dice, use \"/roll dice\"; for tables, use \"/table\"."
  })
  @SlashGroup("roll")
  async d66(
    @SlashOption("description", {
      description: "An optional description.",
      required: false,
    })
    description: string = "",
    interaction: CommandInteraction
  ): Promise<void> {
    const dieType = 66;
    return new RollPlaceValuesTask(interaction, { dieType }, Bot.gameData, description).run();
  }
  @Slash("d666", { description: "Roll a d666 (1d6×100 + 1d6×10 + 1d6). For standard dice, use \"/roll dice\"; for tables, use \"/table\"." })
  @SlashGroup("roll")
  async d666(
    @SlashOption("description", {
      description: "An optional description.",
      required: false,
    })
    description: string = "",
    interaction: CommandInteraction
  ): Promise<void> {
    const dieType = 666;
    return new RollPlaceValuesTask(interaction, { dieType }, Bot.gameData, description).run();
  }
}