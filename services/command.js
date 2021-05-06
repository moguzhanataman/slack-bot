const db = require("../utils/db");
const Command = require("../models/command");
/**
 * Handles command CRUD operations
 */
class CommandService {
  /**
   * Given command name, returns command model
   * @param {string} commandName
   * @returns {Future<Command>}
   */
  async getCommandByName(commandName) {
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
      throw new Error("No such command found in database");
    }

    const command = commandResult.rows[0];

    return command;
  }
}

module.exports = CommandService;
