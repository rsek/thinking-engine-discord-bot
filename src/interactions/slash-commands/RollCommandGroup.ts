import "reflect-metadata";
import { Discord, SlashGroup } from "discordx";
import { fileURLToPath } from "url";

console.info("initializing", fileURLToPath(import.meta.url));

@Discord()
@SlashGroup({ name: "roll", description: "Roll dice." })
export abstract class RollCommandGroup { }
