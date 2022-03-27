# Thinking Engine

Thinking Engine is a Discord bot to assist in playing the [*Troika!* TTRPG](https://www.melsonia.com/). In addition to managing Initiative and resolving various dice rolls, it can reference.

## Game Content

Thinking Engine includes game data for the spells, enemies, tables, and items. The data is formatted as YAML and lives in the `game_data` directory. I have yet to document the structure (mainly because I'm still tweaking it); that said, I've kept it pretty simple.

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
