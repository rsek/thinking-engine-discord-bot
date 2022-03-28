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
    }
    // else {
    //   Bot.client.botGuilds = [(client) => client.guilds.cache.map((guild) => guild.id)];
    // }

    // if (process.env.NODE_ENV === "production") {
    //   console.log("Initializing global application commands...");
    //   await Bot.client.initGlobalApplicationCommands({ log: true });
    // } else  {
    console.log("Initializing application commands...");
    await Bot.client.initApplicationCommands({ guild: { log: true }, global: { log: true } });
    // }

    console.log("Initializing application command permissions...");
    await Bot.client.initApplicationPermissions(true);

    const commands = await Bot.client.fetchApplicationCommands();

    console.log("Bot has the following commands registered:");
    console.log(commands);

    console.log(`Bot started in ${process.env.NODE_ENV ?? "[ERROR]"} mode.`);

    console.log(`Bot is a member of ${Bot.client.guilds.cache.size} guilds.`);
  }
  @On("interactionCreate")
  async onInteractionCreate([interaction]: ArgsOf<"interactionCreate">) {
    // console.log("[Bot.client.botGuilds]", Bot.client.botGuilds);
    // const logItems = ["[interactionCreate]"];

    // switch (interaction.type) {
    //   case InteractionType.ApplicationCommand: {
    //     logItems.push("Application Command", (interaction as CommandInteraction).commandName);
    //     break;}
    //   case InteractionType.MessageComponent: {
    //     logItems.push("Message Component",
    //       ComponentType[(interaction as MessageComponentInteraction).componentType],
    //       (interaction as MessageComponentInteraction).customId);
    //     if ((interaction as MessageComponentInteraction).componentType === ComponentType.SelectMenu) {
    //       logItems.push((interaction as SelectMenuInteraction).valueOf(),...(interaction as SelectMenuInteraction).values);
    //     }
    //     break;
    //   }
    //   default:
    //     break;
    // }
    // console.log(...logItems);
    await Bot.client.executeInteraction(interaction, true);
  }
}

void Bot.start();