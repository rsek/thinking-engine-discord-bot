import "reflect-metadata";
import { Intents, Interaction } from "discord.js";
import { Client } from "discordx";
import { dirname, importx } from "@discordx/importer";
import { readFileSync } from "fs";

console.log("Bot is starting...");

type configType = {clientId: string, guildIds: string[], token: string };

const config: configType = JSON.parse(readFileSync("./src/config.json", "utf-8")) as configType;


export const client = new Client({
  botId: config.clientId,
  botGuilds: config.guildIds ?? undefined,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  "silent": false,
});

client.once("ready", async () => {
  // make sure all guilds are in cache
  await client.guilds.fetch();

  // init all application commands
  await client.initApplicationCommands({
    guild: { log: true },
    // global: { log: true },
  });

  // init permissions; enabled log to see changes
  await client.initApplicationPermissions(true);

  // uncomment this line to clear all guild commands,
  // useful when moving to global commands from guild commands
  //  await client.clearApplicationCommands(
  //    ...client.guilds.cache.map((g) => g.id)
  //  );

  console.log("Bot started");
});

client.on("interactionCreate", (interaction: Interaction) => {
  client.executeInteraction(interaction);
});

// client.on("messageCreate", (message: Message) => {
//   client.executeCommand(message);
// });

async function run() {

  // w/ cjs
  // await importx(__dirname + "/interactions/slash-commands/**/*.{ts,js}");

  // w es6 modules
  await importx(
    dirname(import.meta.url) + "/interactions/**/*.{ts,js}"
  );


  console.log(JSON.stringify(
    client.CommandByGuild()
  ));


  if (!config.token) {
    throw Error("No config.token found!");
  }
  await client.login(config.token);

  // // ************* rest api section: start **********

  // // api: prepare server
  // const server = new Koa();

  // // api: need to build the api server first
  // await server.build();

  // // api: let's start the server now
  // const port = process.env.PORT ?? 3000;
  // server.listen(port, () => {
  //   console.log(`discord api server started on ${port}`);
  //   console.log(`visit localhost:${port}/guilds`);
  // });

  // // ************* rest api section: end **********
}

await run();