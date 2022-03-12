// import "reflect-metadata";
// import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
// import { Discord, Slash, SlashOption , SlashGroup} from "discordx";
// import RollUnder from "../../modules/rolls/RollUnder.js";

// @Discord()
// export default class RollUnderCommand {
//   @Slash("under", {
//     description: "Make a roll to score equal to or under a target number"})
//   @SlashGroup("roll")
//   static under(
//     @SlashOption("target-number", {
//       type: ApplicationCommandOptionType.Number,
//       minValue: 0})
//       targetNumber: number,
//     @SlashOption("description", {
//       type: ApplicationCommandOptionType.String,
//       description: "An optional text description to include with the roll.",
//       required: false
//     })
//       description = "",
//     interaction: CommandInteraction
//   ): Promise<void> {
//     const roll = new RollUnder(targetNumber,description.length ? description : undefined);
//     await interaction.reply({embeds: [roll.toEmbed()]});
//   }
// }