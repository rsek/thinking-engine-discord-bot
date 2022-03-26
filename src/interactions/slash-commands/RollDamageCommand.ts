import "reflect-metadata";
import { CommandInteraction, AutocompleteInteraction, ApplicationCommandOptionType, InteractionType, Collection } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import Armour from "../../constants/Armour.js";
import queryCollection from "../autocomplete/queryCollection.js";
import RollDamage from "../../modules/rolls/RollDamage.js";
import { RefType } from "../../modules/parseComponent/WidgetType.js";
import enumToRecord from "../../utils/enumToRecord.js";
import GameData from "../../data/gameData.js";
import DamageInfo from "../../modules/DamageRoll/DamageInfo.js";

@Discord()
export abstract class RollDamageCommand {
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
    // discord.ts claims this can be done with just the enum, but it apparently requires a standard object.
    // if they fixed it, 'armour' can instead be passed directly
    @SlashChoice(enumToRecord(Armour))
      armour: Armour,

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
    const collection = GameData[RefType.DamageTable] as Collection<string, DamageInfo>;
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