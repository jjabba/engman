class Event {
    constructor(taskId, type, ownerId, status) {
        this.taskId = taskId
        this.type = type
        this.ownerId = ownerId
        this.status = status
    }
}

module.exports = Event;
