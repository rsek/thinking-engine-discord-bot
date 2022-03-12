// import "reflect-metadata";
// import { Discord, Slash, SlashGroup, SlashOption} from "discordx";
// import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction, InteractionReplyOptions, InteractionType } from "discord.js";
// import GameData from "../../data/GameData.js";
// import queryRecord from "../autocomplete/queryRecord.js";
// import { RefType } from "../../modules/parseComponent/WidgetType.js";

// @Discord()
// export default abstract class RollTableCommand {
//   @Slash("table", {description: "Roll on a table."})
//   @SlashGroup("roll")
//   static rollTable(
//     @SlashOption( "table-name",
//       {
//         description: "The table to be rolled on.",
//         type: ApplicationCommandOptionType.String,
//         autocomplete: true
//       })
//       id: string,
//     @SlashOption("preview", {
//       description: "Display a preview of the table instead of rolling on it. (default: false)",
//       type: ApplicationCommandOptionType.Boolean,
//       required: false
//     })
//       preview: boolean = false,
//     interaction: CommandInteraction|AutocompleteInteraction
//   ): Promise<void> {
//     switch (interaction.type) {
//       case InteractionType.ApplicationCommandAutocomplete: {
//         interaction = interaction as AutocompleteInteraction;
//         const focusedOption = interaction.options.getFocused(true);
//         if (focusedOption.name === "table-name") {
//           return interaction.respond(
//             queryRecord(focusedOption.value as string, GameData[RefType.Table])
//           );
//         }
//         break;
//       }
//       case InteractionType.ApplicationCommand: {
//         interaction = interaction as CommandInteraction;
//         const tableData = GameData[RefType.Table][id];
//         if (!tableData) {
//           await interaction.reply({
//             content:`Couldn't find a table named ${id}.`,
//             ephemeral: true});
//           return;
//         }
//         const result: InteractionReplyOptions = {};
//         if (preview) {
//           await interaction.reply(tableData.toPreviewMessage());
//         } else {
//           await interaction.reply(tableData.toRollMessage());
//         }
//         break;
//       }
//       default:
//         break;
//     }
//   }
// }
