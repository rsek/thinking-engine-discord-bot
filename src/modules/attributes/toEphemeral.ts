import type { CacheType, GuildCacheMessage } from "discord.js";
import { BitField, MessageFlags } from "discord.js";

export function asEphemeral<T extends GuildCacheMessage<CacheType>>(message: T) {
  const flags = new BitField(message.flags);
  message.flags = flags.add(MessageFlags.Ephemeral);
  return message;
}

export function stripEphemeral<T extends GuildCacheMessage<CacheType>>(message: T) {
  const flags = new BitField(message.flags);
  message.flags = flags.remove(MessageFlags.Ephemeral);
  return message;
}