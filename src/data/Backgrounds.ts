import { Collection } from "discord.js";
import type Background from "../modules/reference/Background.js";
// FIXME: empty placeholder class
export default class Backgrounds extends Collection<string, Background> {
  constructor() {
    super();
  }
}

