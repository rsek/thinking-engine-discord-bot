import type { CacheType, GuildCacheMessage } from "discord.js";
import { BitField, MessageFlags } from "discord.js";

/**
 * "Convert a message to an ephemeral message."
 * @param {T} message - The message to be converted.
 * @returns A new GuildCacheMessage with the Ephemeral flag set.
 */
export function toEphemeral<T extends GuildCacheMessage<CacheType>>(message: T) {
  const flags = new BitField(message.flags);
  message.flags = flags.add(MessageFlags.Ephemeral);
  return message;
}

/**
 * Strip the Ephemeral flag from a message.
 *
 * @param {T} message - The message to strip the ephemeral flag from.
 * @returns The message with the ephemeral flag removed.
 */
export function stripEphemeral<T extends GuildCacheMessage<CacheType>>(message: T) {
  const flags = new BitField(message.flags);
  message.flags = flags.remove(MessageFlags.Ephemeral);
  return message;
}