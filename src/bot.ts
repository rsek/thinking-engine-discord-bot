import "reflect-metadata";
import "source-map-support/register.js";
import type { ArgsOf } from "discordx";
import { Client, Discord, On, Once } from "discordx";
import { dirname, importx } from "@discordx/importer";
import dotenv from "dotenv";

dotenv.config();

console.log("Bot is starting...");

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
/**
 * Starts the bot.
 */
async function run() {
  await importx(
    dirname(import.meta.url) + "/interactions/{slash-commands,components}/**/*.{ts,js}"
  );

  const commands = await client.CommandByGuild();

  if (!process.env.DISCORD_TOKEN) {
    throw Error("No DISCORD_TOKEN found in .env file.");
  }
  await client.login(process.env.DISCORD_TOKEN );
}

await run();
