import type { InteractionReplyOptions } from "discord.js";

/**
 * It returns a message that is ephemeral and contains the error message.
 * @param {string} [error=An error has occurred.] - The error message to display.
 * @returns A message object that can be sent to the user.
 */
export default function userErrorMessage(error: string = "An error has occurred.") {
  const message: InteractionReplyOptions = {
    content: error,
    ephemeral: true,
  };
  return message;
}
