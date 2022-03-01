import "reflect-metadata";
import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption , SlashGroup} from "discordx";
import RollVersus from "../../troika/classes/RollVersus.js";

@Discord()
export default abstract class RollVersusCommand {
  @Slash("versus", {
    description: "Two opponents each roll 2d6 and add any applicable bonuses. The higher total wins."})
  @SlashGroup("roll")
  async versus(
    @SlashOption("character-bonus", {
      type: "NUMBER",
      minValue: 0})
      characterBonus: number,
    @SlashOption("opponent-bonus", {
      type: "NUMBER",
      minValue: 0})
      opponentBonus: number,
    @SlashOption("character-name",{
      type: "STRING",
      description: "The character's name.",
      required: false
    })
      characterName = "Player",
    @SlashOption("opponent-name", {
      type: "STRING",
      description: "A name or label for the opponent.",
      required: false})
    opponentName = "Opponent",
    @SlashOption("description", {
      type: "STRING",
      description: "An optional text description to include with the roll.",
      required: false
    })
    description = "",
    interaction: CommandInteraction
  ): Promise<void> {
    const roll = new RollVersus(characterBonus,opponentBonus,characterName,opponentName, description.length ? description : undefined);

    await interaction.reply({embeds: [roll.toEmbed()]});
  }
}