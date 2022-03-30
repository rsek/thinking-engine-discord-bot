/* eslint-disable no-console */
// run this to wipe all global application (slash) commands
// note that global commands take some time to propagate, so wiping them (or replacing them with new ones) may not be instantaneous

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.DISCORD_TOKEN as string;

const clientId = process.env.CLIENT_ID as string;

const rest = new REST({ version: "10" }).setToken(token);

void (async () => {
  try {
    console.log("Wiping global application commands...");

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: [] },
    );

    console.log("Successfully wiped commands.");
  } catch (error) {
    console.error(error);
  }
})();
