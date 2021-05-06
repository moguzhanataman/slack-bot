class Task {
  constructor(command_id, user_id, value, created_at, id) {
    this.id = id || -1;
    this.command_id = command_id;
    this.user_id = user_id;
    this.value = value;
    this.created_at = created_at;
  }
}

module.exports = Task;
