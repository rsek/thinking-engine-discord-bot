import "reflect-metadata";
import { Discord, SlashGroup} from "discordx";

@Discord()
@SlashGroup({
  name: "roll",
  description: "Roll dice." })
export default abstract class RollCommandGroup {
}
