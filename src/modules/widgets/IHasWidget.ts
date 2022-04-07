import type { IRendersMessage } from "./IRenders.js";
import type { WidgetType } from "./WidgetType.js";

export default interface IHasWidget<T extends WidgetType> extends IRendersMessage {
  readonly widgetType: T;
}