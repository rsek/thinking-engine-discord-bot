import { Discord, SlashGroup } from "discordx";

@Discord()
@SlashGroup({ name: "roll", description: "Roll dice. To roll on a table, use \"/table\"." })
export default abstract class RollCommandGroup { }
