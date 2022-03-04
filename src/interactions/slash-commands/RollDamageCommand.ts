import { CommandInteraction, AutocompleteInteraction, ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import Attack from "../../classes/Attack.js";
import RollDamage from "../../classes/RollDamage.js";
import Armour from "../../constants/Armour.js";
import gameData from "../../data/gameData.js";
import queryRecord from "../autocomplete/queryRecord.js";

@Discord()
export default abstract class RollDamageCommand {
  @Slash("damage", {description: "Roll damage."})
  @SlashGroup("roll")
  async rollTable(
    @SlashOption( "weapon",
      {
        description: "The spell or weapon damage to use.",
        type: "STRING",
        autocomplete: true
      })
      attackId: string,
    @SlashOption("shield", {
      description: "Whether the target has a shield or not.",
      type: "BOOLEAN"
    })
      shield: boolean,
    // this should just be a single SlashChoice with the enum piped in, but it's not cooperating for some reason
    // @SlashChoice("Unarmoured", 0)
    // @SlashChoice("Lightly armoured", 1)
    // @SlashChoice("Modestly armoured", 2)
    // @SlashChoice("Heavily armoured", 3)
    @SlashOption("armour", {
      minValue: 0,
      maxValue: 3,
      description: "The armour type of the target.",
      type: "INTEGER",
    })
      armour: number,
    @SlashOption("bonus", {
      description: "Any bonuses to the damage roll.",
      type: "INTEGER"
    })
      bonus: number,
      interaction: CommandInteraction|AutocompleteInteraction
  ): Promise<void> {
    switch (interaction.type) {
      case "APPLICATION_COMMAND_AUTOCOMPLETE": {
        interaction = interaction as AutocompleteInteraction;
        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name === "weapon") {
          return interaction.respond(
            queryRecord(focusedOption.value as string, gameData.attacks)
          );
        }
        break;
      }
      case "APPLICATION_COMMAND": {
        interaction = interaction as CommandInteraction;
        const attack = gameData.attacks[attackId];
        if (!attack) {
          await interaction.reply({
            content:`Couldn't find a weapon or spell for ${attackId}.`,
            ephemeral: true});
          return;
        }
        const roll = new RollDamage(attack, bonus, armour, shield);
        await interaction.reply({
          embeds: [roll.toEmbed()],
        });
        break;
      }
      default:
        break;
    }
  }
  @ButtonComponent(/^show-damage:(.*)$/)
  async showDamage(interaction: ButtonInteraction) {
    await interaction.reply("NYI");
  }
}