class EventRepository {  
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskId TEXT,
        type TEXT,
        createdAt TEXT,
        ownerId TEXT,
        status TEXT,
        CONSTRAINT tasks_fk_taskId FOREIGN KEY (taskId)
          REFERENCES tasks(id) ON UPDATE CASCADE ON DELETE CASCADE)`
      return this.dao.run(sql)
    }

    create(event) {
      const { taskId, type, ownerId, status } = event
      return this.dao.run(
        `INSERT INTO events (taskId, type, createdAt, ownerId, status)
          VALUES (?, ?, datetime('now', 'utc'), ?, ?)`,
        [taskId, type, ownerId, status]
      )
    }
}

module.exports = EventRepository
