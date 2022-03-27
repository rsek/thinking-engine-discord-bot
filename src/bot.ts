import "reflect-metadata";

import { IntentsBitField } from "discord.js";
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
    if (!process.env.DISCORD_TOKEN) {
      throw Error("Could not find DISCORD_TOKEN in your environment");
    }
    if (process.env.NODE_ENV === "development" && !process.env.GUILD) {
      throw new Error("NODE_ENV is set to development, but no test guild ID was provided.");
    }
    const botGuilds = process.env.NODE_ENV === "development" && process.env.GUILD ? [process.env.GUILD] : undefined;

    const intents =  [
      IntentsBitField.Flags.Guilds,
      // FIXME: not sure if this one is needed. determine if anything breaks when you turn it off.
      IntentsBitField.Flags.GuildMessages,
      // FIXME: not sure if this one is needed. determine if anything breaks when you turn it off.
      // IntentsBitField.Flags.GuildWebhooks,
      IntentsBitField.Flags.DirectMessages
    ];

    this._client = new Client({
      botGuilds,
      intents,
      silent: false,
    });

    await importx(
      dirname(import.meta.url) +
      "/interactions/{slash-commands,components}/**/*.{ts,js}"
    );

    await this._client.login(process.env.DISCORD_TOKEN);
  }
  private static _client: Client;

  @Once("ready")
  async onceReady( ) {
    if (process.env.NODE_ENV === "production") {
      await Bot.client.initGlobalApplicationCommands();
    } else  {
      await Bot.client.initApplicationCommands();
    }
    await Bot.client.initApplicationPermissions(true);
    console.log("Bot started");
  }
  @On("interactionCreate")
  async onInteractionCreate( [interaction]: ArgsOf<"interactionCreate">, ) {
    await Bot.client.executeInteraction(interaction, true);
  }
}

void Bot.start();