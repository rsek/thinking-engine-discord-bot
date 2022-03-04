export default class AdvancedSkill {
  Name: string;
  Value: number;
  constructor(name: string, value=0) {
    if (value < 0) {
      throw new Error();
    }
    this.Name = name;
    this.Value = value;
  }
}