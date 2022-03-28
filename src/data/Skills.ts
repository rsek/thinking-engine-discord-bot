import { Collection } from "discord.js";
import Skill from "../modules/PlayerCharacter/Skill.js";
import { singleton, container } from "tsyringe";

@singleton()
export default class Skills extends Collection<string, Skill> {
  constructor() {
    super();
  }
}

