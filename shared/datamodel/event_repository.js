class EventRepository {  
    constructor(dao) {
      this.dao = dao
    }
  
    createTable() {
      const sql = `
      `
      return this.dao.run(this.dao.getCreateFor('events'))
    }

    create(event) {
      const { taskId, type, ownerId, status } = event
      return this.dao.run( this.dao.getInsertFor('event'),
        [taskId, type, ownerId, status]
      )
    }
}

module.exports = EventRepository
