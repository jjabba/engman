class Task {
    constructor(t, formatDate) {
        if (t.hasOwnProperty('_rawJson')) {
            const userStory = t.get('User Story')
            const owner = t.get('Task Owner')
            const name = t.get('Name')
            this.id = t.id
            this.name = name ? name : null
            this.owner = owner ? owner.id : null
            this.estimate = t.get('Estimate') ? t.get('Estimate') : null
            this.status = t.get('Status') ? t.get('Status') : null
            this.blocked = t.get('Blocked') | 0
            this.unplanned = t.get('Unplanned') | 0
            this.createdAt = formatDate ? formatDate(t._rawJson.createdTime) : t._rawJson.createdTime
            this.userStoryId = userStory && userStory.length > 0 ? userStory[0] : null
        } else {
            this.id = t.id
            this.name = t.name
            this.owner = t.owner
            this.estimate = t.estimate
            this.status = t.status
            this.blocked = t.blocked ? parseInt(t.blocked) : 0
            this.unplanned = t.unplanned ? parseInt(t.unplanned) : 0
            this.createdAt = t.createdAt
            this.userStoryId = t.userStoryId
        }
    }
}

module.exports = Task;
