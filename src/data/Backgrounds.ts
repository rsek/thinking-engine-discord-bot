import { Collection } from "discord.js";
import type Background from "../modules/reference/Background.js";

export default class Backgrounds extends Collection<string, Background> {
  constructor() {
    super();
  }
}

