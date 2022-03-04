import "reflect-metadata";
import { Discord, Slash, SlashGroup} from "discordx";
import { CommandInteraction } from "discord.js";
import RollPlaceValues from "../../classes/RollPlaceValues.js";

@Discord()
export default abstract class RollD66Command {
  @Slash("d66", {description: "Roll a d66 (1d6×10 + 1d6). For standard dice, use '/roll dice' instead."})
  @SlashGroup("roll")
  async d66(
    interaction: CommandInteraction
  ): Promise<void> {
    const roll = new RollPlaceValues(2, 6);
    await interaction.reply(`Rolled ${roll.toDiceExpression()}: ${roll.toString()}`);
  }
}