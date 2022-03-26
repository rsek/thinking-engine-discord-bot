import IEnemyBase from "./IEnemyBase";

export default interface IEnemyYaml extends IEnemyBase{
  Skill: number;
  Stamina: number;
  Initiative: number;
  Armour: number;
}