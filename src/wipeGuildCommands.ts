// run this to wipe all guild application (slash) commands

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.DISCORD_TOKEN as string;

const clientId = process.env.CLIENT_ID as string;
const guildId = process.env.GUILD as string;

const rest = new REST({ version: "10" }).setToken(token);

void (async () => {
  try {
    console.log("Wiping guild application commands...");

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: [] },
    );

    console.log("Successfully wiped commands.");
  } catch (error) {
    console.error(error);
  }
})();
