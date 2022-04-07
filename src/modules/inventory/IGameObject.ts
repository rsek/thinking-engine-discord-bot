import type { IRendersMessage } from "../widgets/IRenders.js";
import type { RefType, WidgetType } from "../widgets/WidgetType.js";


export default interface IGameObject extends  IRendersMessage {
  widgetTypes: WidgetType[];
  refType: RefType;
  $id: string;
  Name: string;
  Description?: string | undefined;
}
