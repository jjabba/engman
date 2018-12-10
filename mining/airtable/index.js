const Airtable = require('airtable');

class TaskMiner {

    constructor(key, base, table, view) {
        this.key = key
        this.base = base
        this.table = table
        this.view = view
    }

    getAllTasks() {
        var base = new Airtable({apiKey: this.key}).base(this.base);

        return base(this.table)
        .select({
            maxRecords: 500,
            pageSize: 5,
            view: this.view
        })
        .all()
    }
}

module.exports = TaskMiner
