import "reflect-metadata";
import { Discord, SlashGroup } from "discordx";

@Discord()
@SlashGroup({ name: "roll", description: "Roll dice. To roll on a table, use \"/table\"." })
export abstract class RollCommandGroup { }
