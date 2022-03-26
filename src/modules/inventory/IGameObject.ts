import { IRendersEmbed, IRendersMessage } from "../attributes/IRenders.js";
import { RefType, WidgetType } from "../parseComponent/WidgetType.js";


export default interface IGameObject extends  IRendersMessage {
  WidgetTypes: WidgetType[];
  Type: RefType;
  $id: string;
  Name: string;
  Description?: string | undefined;
}
