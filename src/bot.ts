import "reflect-metadata";

import { CommandInteraction, ComponentType, IntentsBitField, InteractionType, MessageComponentInteraction, SelectMenuInteraction } from "discord.js";
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
      // FIXME: not sure if this one is needed. determine if anything breaks when you turn it off.
      IntentsBitField.Flags.GuildMessages,
      // FIXME: not sure if this one is needed. determine if anything breaks when you turn it off.
      // IntentsBitField.Flags.GuildWebhooks,
      IntentsBitField.Flags.DirectMessages
    ];

    // const botGuilds = process.env.NODE_ENV === "development" && process.env.GUILD ? [process.env.GUILD] : undefined;

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
    } else {
      Bot.client.botGuilds = [(client) => client.guilds.cache.map((guild) => guild.id)];
    }

    // console.log("[Bot.client.botGuilds]", Bot.client.botGuilds);

    if (process.env.NODE_ENV === "production") {
      await Bot.client.initGlobalApplicationCommands();
    } else  {
      await Bot.client.initApplicationCommands();
    }
    // FIXME: disabling this to see what breaks. if it's not needed, get rid of it.
    // await Bot.client.initApplicationPermissions(true);

    console.log(`Bot started in ${process.env.NODE_ENV ?? "[ERROR]"} mode.`);

    console.log(`Bot is a member of ${Bot.client.guilds.cache.size} guilds.`);
  }
  @On("interactionCreate")
  async onInteractionCreate([interaction]: ArgsOf<"interactionCreate">) {
    // console.log("[Bot.client.botGuilds]", Bot.client.botGuilds);
    const logItems = ["[interactionCreate]"];

    switch (interaction.type) {
      case InteractionType.ApplicationCommand: {
        logItems.push("Application Command", (interaction as CommandInteraction).commandName);
        break;}
      case InteractionType.MessageComponent: {
        logItems.push("Message Component",
          ComponentType[(interaction as MessageComponentInteraction).componentType],
          (interaction as MessageComponentInteraction).customId);
        if ((interaction as MessageComponentInteraction).componentType === ComponentType.SelectMenu) {
          logItems.push((interaction as SelectMenuInteraction).valueOf(),...(interaction as SelectMenuInteraction).values);
        }
        break;
      }
      default:
        break;
    }
    console.log(...logItems);
    await Bot.client.executeInteraction(interaction, true);
  }
}

void Bot.start();