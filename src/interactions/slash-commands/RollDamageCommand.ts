import "reflect-metadata";

import { CommandInteraction, AutocompleteInteraction, ApplicationCommandOptionType, InteractionType } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import queryCollection from "../autocomplete/queryCollection.js";
import RollDamage from "../../modules/rolls/RollDamage.js";
import DamageInfo from "../../modules/reference/DamageInfo.js";
import { container } from "tsyringe";
import DamageTables from "../../data/DamageTables.js";

@Discord()
export abstract class RollDamageCommand {
  readonly _gameData = container.resolve(DamageTables);
  @Slash("damage", { description: "Roll damage." })
  @SlashGroup("roll")
  async rollTable(
    @SlashOption("table",
      {
        description: "The damage table to use.",
        type: ApplicationCommandOptionType.String,
        autocomplete: true
      })
      damageId: string,

    @SlashOption("shield", {
      description: "Whether the target has a shield or not.",
      type: ApplicationCommandOptionType.Integer
    })
    @SlashChoice({ "No shield": 0, Shield: 1, })
      shield: number,

    @SlashOption("armour", {
      description: "The armour type of the target.",
    })
    // FIXME: discord.ts claims this can be done with just the enum, but it apparently requires a standard object.
    // if they fixed it, 'armour' can instead be passed directly
    @SlashChoice({
      "0 (Unarmoured)": 0,
      "1 (Lightly Armoured)": 1,
      "2 (Modestly Armoured)": 2,
      "3 (Heavily Armoured)": 3,
      4: 4,
      5: 5,
    })
      armour: number,

    @SlashOption("modifier", {
      description: "Any additional modifiers to the damage roll.",
      type: ApplicationCommandOptionType.Integer,
      required: false
    })
      modifier: number = 0,

    @SlashOption("description", {
      description: "An optional text description.",
      type: ApplicationCommandOptionType.String,
      required: false,
    })
    description: string | undefined,

    @SlashOption("mighty-blow", {
      description: "Whether to calculate damage as a Mighty Blow.",
      required: false,
    })
    isMightyBlow: boolean = false,

    interaction: CommandInteraction|AutocompleteInteraction
  ): Promise<void> {
    const collection = this._gameData;
    switch (interaction.type) {
      case InteractionType.ApplicationCommandAutocomplete: {
        interaction = interaction as AutocompleteInteraction;
        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name === "table") {
          return interaction.respond(
            queryCollection(focusedOption.value as string, collection)
          );
        }
        break;
      }
      case InteractionType.ApplicationCommand: {
        interaction = interaction as CommandInteraction;
        if (!collection.has(damageId)) {
          return interaction.reply({
            content: `Couldn't find a damage table for \`${damageId}\`.`,
            ephemeral: true
          });
        }
        const damage = collection.get(damageId) as DamageInfo;
        const roll = new RollDamage(damage, modifier, armour, shield, description, isMightyBlow);
        return interaction.reply(roll.toMessage());
        break;
      }
      default:
        break;
    }
  }
}