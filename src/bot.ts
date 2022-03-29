import "reflect-metadata";

import { ApplicationCommand, Collection, IntentsBitField } from "discord.js";
import { dirname, importx } from "@discordx/importer";
import { ArgsOf, Client, Discord, On, Once } from "discordx";
import dotenv from "dotenv";

dotenv.config();

@Discord()
export abstract class Bot {
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
  async onInteractionCreate([interaction]: ArgsOf<"interactionCreate">) {
    await Bot.client.executeInteraction(interaction, true);
  }
}

void Bot.start();