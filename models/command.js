const db = require("../utils/db");
class Command {
  static fields = ["name", "factor", "id"];

  constructor(name, factor, id) {
    this.id = id || -1;
    this.name = name;
    this.factor = factor;
  }

  /**
   * Given command name, returns command model
   * @param {string} commandName
   * @returns {Future<Command>}
   */
  static async findByName(commandName) {
    const commandResult = await db.query(
      `
      SELECT ${Command.fields.join(",")} 
      FROM commands 
      WHERE name = $1 
      LIMIT 1
      `,
      [commandName]
    );

    if (commandResult.rowCount < 1) {
      throw new Error(`No such command found as ${commandName} in database`);
    }

    const command = commandResult.rows[0];

    return new Command(command.name, command.factor, command.id);
  }
}

module.exports = Command;
