// import "reflect-metadata";
// import { Discord, Slash, SlashGroup} from "discordx";
// import { CommandInteraction } from "discord.js";
// import D66 from "../../troika/classes/D66.js";

// @Discord()
// export default abstract class D66Command {
//   @Slash("d66", {description: "Roll a d66"})
//   @SlashGroup("roll")
//   async d66(
//     interaction: CommandInteraction
//   ): Promise<void> {
//     const roll = new D66();
//     await interaction.reply(roll.toString());
//   }
// }