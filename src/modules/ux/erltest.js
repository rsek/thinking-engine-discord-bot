import { Packr, Unpackr } from "msgpackr";

// CONSIDER: receiving an incomplete options json object could simply send a prompt for the next empty parameter (with the params that are already set as passthrough data)

// if i'm storing json in customIDs/menu option values, it's probably a good idea to have some input limit on strings.

// an alternative place to put user strings: label/description. may not be worth

// the real question might be: how am i regexing for these things?


// Ôr@¨incField
// Ôr@£fff

const packr = new Packr();
const unpackr = new Unpackr();

// could generalize the key a bit. like, attr

/// Ôr@£refÔrA¤type¤item
let testobj = {
  agdgagd: { // consider: incAttr, or just attr?
    type: "item"
  }
};

let basicString = JSON.stringify(testobj)

console.log(`stringified JSON is ${basicString.length} chars`);

// base64 works but is longer (of course)
// latin1 packs 74 chars as 61 chars
// utf8 and utf16le don't work - something about missing terminator characters? 8( which is a bummer, because utf16le drops it to 30 chars

let packed = packr.pack(testobj);
console.log("[packed]", packed);
let packedString = packed.toString("latin1");
console.log(`[packedString] ${packedString.length} chars:`, packedString);
let newBuffer = Buffer.from(packedString, "latin1");
console.log("[newBuffer]", newBuffer);
let newJson = unpackr.unpack(newBuffer);
console.log(newJson);
