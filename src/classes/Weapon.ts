import IWeapon from "../data/interfaces/IWeapon.js";
import Attack from "./Attack.js";

export default class Weapon implements IWeapon {
  Name: string;
  Attacks: Attack[];
  Description?: string | undefined;
  Charges?: number | undefined;
  constructor(name: string, weapon: IWeapon) {
    this.Name = name;
    this.Attacks = weapon.Attacks.map(atk => new Attack(this.Name, atk));
    this.Description = weapon.Description;
    this.Charges = weapon.Charges;
  }
}