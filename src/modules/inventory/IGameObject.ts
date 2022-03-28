import { IRendersMessage } from "../widgets/IRenders.js";
import { RefType, WidgetType } from "../widgets/WidgetType.js";


export default interface IGameObject extends  IRendersMessage {
  WidgetTypes: WidgetType[];
  Type: RefType;
  $id: string;
  Name: string;
  Description?: string | undefined;
}
