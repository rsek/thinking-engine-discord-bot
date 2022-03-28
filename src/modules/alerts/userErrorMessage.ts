import { InteractionReplyOptions } from "discord.js";

export default function userErrorMessage(error: string = "An error has occurred.") {
  const message: InteractionReplyOptions = {
    content: error,
    ephemeral: true,
  };
  return message;
}
