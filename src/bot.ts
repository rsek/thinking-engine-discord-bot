/* eslint-disable no-console */
import "reflect-metadata";

import { dirname, importx } from "@discordx/importer";
import { ComponentType, IntentsBitField, InteractionType } from "discord.js";
import type { ApplicationCommand, Collection, MessageComponentInteraction, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";
import { ArgsOf, Client, Discord, On, Once } from "discordx";
import dotenv from "dotenv";
import Backgrounds from "./data/Backgrounds.js";
import Bestiary from "./data/Bestiary.js";
import DamageTables from "./data/DamageTables.js";
import GameData from "./data/GameData.js";
import Items from "./data/Items.js";
import Skills from "./data/Skills.js";
import Spells from "./data/Spells.js";
import Tables from "./data/Tables.js";
import { unpackTaskParams } from "./modules/tasks/packTaskParams.js";
import { routeTask } from "./modules/tasks/routeTask.js";
import unpackSubmittedModal from "./modules/tasks/unpackSubmittedModal.js";

dotenv.config();

const backgrounds =  new Backgrounds();
const bestiary =  new Bestiary();
const items =  new Items();
const skills =  new Skills();
const spells =  new Spells();
const damageTables =  new DamageTables(items, spells);
const tables =  new Tables(bestiary);

@Discord()
export abstract class Bot {
  static get gameData(): GameData {
    return this._gameData;
  }
  static get client(): Client {
    return this._client;
  }
  static async start(): Promise<void> {
    await importx(
      dirname(import.meta.url) +
      "/interactions/{slash-commands,components}/**/*.{ts,js}"
    );
    if (!process.env.DISCORD_TOKEN) {
      throw Error("Could not find DISCORD_TOKEN in your environment");
    }
    if (process.env.NODE_ENV === "development" && !process.env.GUILD) {
      throw new Error("NODE_ENV is set to development, but no test guild ID was provided.");
    }
    const intents =  [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.DirectMessages
    ];

    this._client = new Client({
      intents,
      silent: false,
    });

    await this._client.login(process.env.DISCORD_TOKEN);
  }
  static async routeMessageComponent(interaction: MessageComponentInteraction) {
    switch (interaction.componentType) {
      case ComponentType.Button: {
        const params = unpackTaskParams(interaction.customId);
        return routeTask(params, interaction, Bot.gameData);
        break;
      }
      case ComponentType.SelectMenu: {
        const value = (interaction as SelectMenuInteraction).values[0];
        const params = unpackTaskParams(value);
        return routeTask(params, interaction, Bot.gameData);
        break;
      }
      default:
        return interaction.reply({
          content: `ERROR: Unknown handler for component of type \`${ComponentType[interaction.componentType]}\`\ncustomId: \`${interaction.customId}\``,
          ephemeral: true
        });
        break;
    }
  }
  private static readonly _gameData: GameData = new GameData(
    backgrounds,
    bestiary,
    damageTables,
    items,
    skills,
    spells,
    tables,
  );

  private static _client: Client;

  @Once("ready")
  async onceReady( ) {
    await Bot.client.guilds.fetch();

    if (process.env.NODE_ENV === "development" && process.env.GUILD) {
      Bot.client.botGuilds = [process.env.GUILD];
    }

    console.log("Initializing application commands...");
    await Bot.client.initApplicationCommands({ guild: { log: true }, global: { log: true } });

    console.log("Initializing application command permissions...");
    await Bot.client.initApplicationPermissions(true);

    const commands = await Bot.client.fetchApplicationCommands() as Collection<string, ApplicationCommand>;

    console.log(`Bot started in ${process.env.NODE_ENV ?? "[ERROR]"} mode.`);

    console.log(`Bot is a member of ${Bot.client.guilds.cache.size} guilds.`);
  }
  @On("interactionCreate")
  async onInteractionCreate([interaction]: ArgsOf<"interactionCreate">): Promise<void|unknown> {
    switch (interaction.type) {
      case InteractionType.MessageComponent:
        // routes to custom handler for components, whose customIds are used to store json
        return Bot.routeMessageComponent(interaction as MessageComponentInteraction);
      case InteractionType.ModalSubmit: {
        const newParams = unpackSubmittedModal(interaction as ModalSubmitInteraction);
        return routeTask(newParams, interaction, Bot.gameData);
      }
      default:
        return Bot.client.executeInteraction(interaction, true);
        break;
    }
  }
}

void Bot.start();