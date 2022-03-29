import type { InteractionReplyOptions, InteractionUpdateOptions, MessageOptions } from "discord.js";
import type WithRequired from "../../types/WithRequired.js";
import type { APIMessage } from "node_modules/discord.js/node_modules/discord-api-types/v10.js";

export type MessageWithEmbeds = WithRequired<InteractionReplyOptions | InteractionUpdateOptions | MessageOptions | APIMessage, "embeds">;
