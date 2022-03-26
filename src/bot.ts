import "reflect-metadata";
import "source-map-support/register.js";
import type { ArgsOf } from "discordx";
import { Client, Discord, On, Once } from "discordx";
import { dirname, importx } from "@discordx/importer";
import dotenv from "dotenv";

dotenv.config();
// console.log(process.env);

console.log("Bot is starting...");

// type configType = {clientId: string, guildIds: string[], token: string };
// const config: configType = JSON.parse(readFileSync("./src/config.json", "utf-8")) as configType;

export const client = new Client({
  botGuilds: process.env.GUILD ? [process.env.GUILD] : undefined,
  intents: [
    "Guilds",
    "GuildMessages",
    "GuildWebhooks",
    "DirectMessages",
  ],
  silent: false,
});

// console.log("dirname:", dirname(import.meta.url));

@Discord()
export abstract class AppDiscord {
  @Once("ready")
  async onceReady() {
  // make sure all guilds are in cache
    await client.guilds.fetch();
    // init all application commands
    if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
      await client.initApplicationCommands({
        global: { log: true },
      });
    } else {
      await client.initApplicationCommands({
        guild: { log: true },
      });
    }
    // init permissions; enabled log to see changes
    await client.initApplicationPermissions(true);
    // clear all guild commands
    if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
      await client.clearApplicationCommands(
        ...client.guilds.cache.map((g) => g.id)
      );
    }
    console.log("Bot started");
  }
  @On("interactionCreate")
  async onInteraction(
    [interaction]: ArgsOf<"interactionCreate">,
    client: Client
  ) {
    await client.executeInteraction(interaction);
  }
}

async function run() {
  await importx(
    dirname(import.meta.url) + "/interactions/{slash-commands,components}/**/*.{ts,js}"
  );

  const commands = await client.CommandByGuild();

  // if (!process.env.DISCORD_TOKEN) {
  //   throw Error("No config.token found!");
  // }
  await client.login(process.env.DISCORD_TOKEN as string);
}

await run();
