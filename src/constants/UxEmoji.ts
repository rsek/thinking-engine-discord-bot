import type { ComponentEmojiResolvable } from "discord.js";
import { Collection } from "discord.js";

const emojiData: [string|number, ComponentEmojiResolvable][] = [
  [ 0, "0️⃣" ],
  [ 1, "1️⃣" ],
  [ 2, "2️⃣" ],
  [ 3, "3️⃣" ],
  [ 4, "4️⃣" ],
  [ 5, "5️⃣" ],
  [ 6, "6️⃣" ],
  [ 7, "7️⃣" ],
  [ 8, "8️⃣" ],
  [ 9, "9️⃣" ],
  [ "character", "👤" ],
  [ "henchman", "👥" ],
  [ "shuffle", "🔄" ]
];

const UX_EMOJI = new Collection<string|number, ComponentEmojiResolvable>();

emojiData.forEach(([ key, value ]) => UX_EMOJI.set(key, value));


export default UX_EMOJI;