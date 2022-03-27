# Thinking Engine

Thinking Engine is a Discord bot to assist in playing the [*Troika!* TTRPG](https://www.melsonia.com/). In addition to managing Initiative and resolving various dice rolls, it can reference game material like spells, enemies, tables, and items.

You can invite Thinking Engine to your discord server by using [this link](https://discord.com/api/oauth2/authorize?client_id=945547039138254938&permissions=380104902656&scope=bot%20applications.commands). Alternatively, you could build and host the bot yourself (which is mainly of interest if you want to use the bot with your own homebrew content).

## Game Content

Thinking Engine includes game data for the spells, enemies, tables, and items. The data is formatted as YAML and lives in the `game_data` directory. I have yet to document the structure (mainly because I'm still tweaking it); that said, I've kept it pretty simple, so you might be able to muddle through.

You can add your own custom content by creating YAML files following the format of existing SRD content, and adding them to the appropriate sub-directory in `game_data`. The key for each object should be unique, or it will overwrite previous objects with the same key; this can be leveraged to override SRD content.

## Commands

### `/initiative`

Create an interactive initiative stack display. My recommendation is to pin its message, perhaps in its own channel or a channel reserved for dice rolls.

### `/bestiary`

Display a bestiary entry.

### `/spell`

Display a spell's description, cost, etc.

### `/table`

Display or roll on a table.

### `/roll d36`, `/roll d66`, `/roll d666`

Roll using d36, d66, or d666, where multiple d6 are read as place values.

### `/roll damage`

Roll on a specific damage table.

### `/roll under`
Make a 'Roll Under' roll.

### `/roll versus`
Make a 'Roll Versus' roll.

### `/roll dice`

Roll generic dice.

## Credits

* Includes content from the *Troika!* System Resource Document, [available here](https://docs.google.com/document/d/1haUfSVekt2gNab3V2CrL1Pg_sZ-ZlskphwXmSnGT9aw/edit#)
* Icon by Lorc, [available here](https://game-icons.net/1x1/lorc/clockwork.html). Used under the [CC BY 3.0 license](https://creativecommons.org/licenses/by/3.0/).
