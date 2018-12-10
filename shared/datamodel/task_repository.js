class TaskRepository {
    constructor(dao) {
      this.dao = dao
    }

    createTable() {
      const sql = `
        `
      return this.dao.run(this.dao.getCreateFor('tasks'))
    }

    create(task) {
      const { id, name, owner, estimate, status, blocked, unplanned, createdAt, userStoryId } = task
      return this.dao.run(
        `INSERT INTO tasks (id, name, owner, estimate, status, blocked, unplanned, createdAt, userStoryId)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, owner, estimate, status, blocked, unplanned, createdAt, userStoryId]
      )
    }

    update(task) {
      const { id, name, owner, estimate, status, blocked, unplanned, createdAt, userStoryId } = task
      return this.dao.run(
        `UPDATE tasks
        SET name = ?, 
        owner = ?, 
        estimate = ?, 
        status = ?, 
        blocked = ?, 
        unplanned = ?, 
        createdAt  = ?, 
        userStoryId = ?
        WHERE id = ?`,
        [name, owner, estimate, status, blocked, unplanned, createdAt, userStoryId, id]
      )
    }

    find(id) {
      const sql = `
        SELECT * FROM tasks WHERE id = (?)`
      return this.dao.get(sql, [id])
    }

    compare(task, dbtask) {
      
    }

}

module.exports = TaskRepository
