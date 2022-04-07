import type { APIEmbedField, EmbedBuilder, EmbedField, InteractionReplyOptions } from "discord.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } from "discord.js";
import type ItemIn from "../../types/ItemIn.js";
import type IGameObject from "../inventory/IGameObject.js";
import { BotTask } from "../tasks/BotTask.js";
import { packTaskParams } from "../tasks/packTaskParams.js";
import embedLength from "../text/embedLength.js";
import { MAX_EMBED_FIELDS, MAX_LENGTH_EMBED_TOTAL } from "../text/embedLimits.js";
import getEmbedFieldLength from "../text/getEmbedFieldLength.js";
import buildWidgetStub from "../widgets/buildWidgetStub.js";
import type WidgetOptions from "../widgets/WidgetOptions.js";
import { RefType, WidgetType } from "../widgets/WidgetType.js";


// FIXME: separate table roll logic in to another class. it can generate its own separate embed.
export default class Table extends Collection<number, string> implements IGameObject {
  readonly widgetTypes: [ WidgetType.Table, WidgetType.TableRoll ] = [ WidgetType.Table, WidgetType.TableRoll ];
  readonly refType = RefType.Table;
  $id: string;
  Name: string;
  Description?: string | undefined;
  private readonly _rollFunc: () => number;
  constructor(name: string, rows: Record<number, string>, rollFunc: () => number, id: string = name, description?: string | undefined) {
    super(Object.entries(rows).map(row => [ Number(row[0]), row[1] ]));
    this.Name = name;
    this.$id = id;
    this.Description = description;
    this._rollFunc = rollFunc;
  }
  toEmbed(...args: any[]): EmbedBuilder {
    throw new Error("Method not implemented.");
  }
  toEmbedGroup(...args: any[]): EmbedBuilder[] {
    throw new Error("Method not implemented.");
  }
  toMessage<T extends ItemIn<this["widgetTypes"]>>(type: T, ephemeral?: boolean): WidgetOptions<InteractionReplyOptions> {
    switch (type) {
      case WidgetType.Table:
        return this.toPreviewMessage(ephemeral);
        break;
      case WidgetType.TableRoll:
        return this.toRollMessage(ephemeral);
        break;
      default:
        throw new RangeError();
        break;
    }
  }
  private toPreviewEmbeds() {
    const rowFields: EmbedField[] = this
      .map((rowText, rowNumber) => ({
        name: rowNumber.toString(),
        value: rowText,
        inline: false
      }));
    let embeds: EmbedBuilder[] = [];
    for (let i = 0, embedCount = 0; i < rowFields.length; i++) {
      const field = rowFields[i];
      if (!embeds[embedCount]) {
        embeds.push(buildWidgetStub(WidgetType.Table, this.Name));
      }
      if ((embedLength(embeds[embedCount]) + getEmbedFieldLength(field)) > MAX_LENGTH_EMBED_TOTAL ||
      ((embeds[embedCount].data.fields?.length ?? 0) >= MAX_EMBED_FIELDS)) {
        embeds.push(buildWidgetStub(WidgetType.Table, `${this.Name}`));
        embedCount++;
      }
      embeds[embedCount].addFields(field);
    }
    if (embeds.length > 1) {
      embeds = embeds.map(embed => {
        const fields = embed.data.fields as APIEmbedField[];
        let newTitle = embed.data.title as string;
        const floor: string = fields[0].name;
        const ceiling: string = fields[fields.length-1].name;
        if (floor === ceiling) {
          newTitle += ` (${ceiling})`;
        } else {
          newTitle += ` (${floor}-${ceiling})`;
        }
        return embed.setTitle(newTitle);
      });
    }
    // TODO: title split?
    return embeds;
  }
  roll() {
    const roll = this._rollFunc();
    return {
      roll,
      row: this.get(roll)
    };
  }
  toRollEmbed() {
    const embed = buildWidgetStub(WidgetType.TableRoll, this.Name);
    const result = this.roll();
    embed.addFields({
      name: result.roll.toString(),
      value: result.row ?? "`Error: Unknown row!`"
    });
    return embed;
  }
  getRollButton(label = "Roll on table") {
    return new ButtonBuilder()
      .setLabel(label)
      .setEmoji({ name: "🎲" })
      .setStyle(ButtonStyle.Primary)
      .setCustomId(packTaskParams(BotTask.RollTable, { id: this.$id }) );
  }
  toPreviewMessage(ephemeral: boolean = true) {
    return {
      ephemeral,
      embeds: this.toPreviewEmbeds(),
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            this.getRollButton()
          )
      ],
    };
  }
  toRollMessage(ephemeral: boolean = false) {
    return {
      ephemeral,
      embeds: [this.toRollEmbed()],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          this.getRollButton("Roll again").setStyle(ButtonStyle.Secondary),
        )
      ]
    };
  }
}