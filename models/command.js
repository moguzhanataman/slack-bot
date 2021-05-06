class Command {
  static fields = ["name", "factor", "id"];
  
  constructor(name, factor, id) {
    this.id = id || -1;
    this.name = name;
    this.factor = factor;
  }
}

module.exports = Command;
