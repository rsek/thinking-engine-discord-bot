import { Collection } from "discord.js";
import { singleton, container } from "tsyringe";
import Background from "../modules/reference/Background.js";

@singleton()
export default class Backgrounds extends Collection<string, Background> {
  constructor() {
    super();
  }
}

