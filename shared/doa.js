// Data Access Object

const sqlite3 = require('sqlite3')
const Promise = require('bluebird')
const logger = require('./logger')

class ScrumDAO {
    constructor(filePath) {
        this.db = new sqlite3.Database(filePath, (err) => {
            if (err) {
                logger.info('Could not connect to database', err)
            } else {
                logger.info('Connected to database')
            }
        })
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    logger.error('Error running sql ' + sql)
                    logger.error(err)
                    reject(err)
                } else {
                    resolve({ id: this.lastID })
                }
            })
        })
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
            if (err) {
                logger.error('Error running sql: ' + sql)
                logger.error(err)
                reject(err)
            } else {
                resolve(result)
            }
            })
        })
    }
    
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
            if (err) {
                console.logger('Error running sql: ' + sql)
                console.logger(err)
                reject(err)
            } else {
                resolve(rows)
            }
            })
        })
    }

    getCreateFor(tableName) {
        switch (tableName) {
            case 'tasks':
                return `
                CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    name TEXT,
                    owner TEXT,
                    estimate TEXT,
                    status TEXT,
                    blocked INTEGER,
                    unplanned INTEGER,
                    createdAt TEXT,
                    userStoryId TEXT
                  )`
                break;
        
            case 'events':
                return `
                CREATE TABLE IF NOT EXISTS events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    taskId TEXT,
                    type TEXT,
                    createdAt TEXT,
                    ownerId TEXT,
                    status TEXT,
                    CONSTRAINT tasks_fk_taskId FOREIGN KEY (taskId)
                      REFERENCES tasks(id) ON UPDATE CASCADE ON DELETE CASCADE)`
                break;
            default:
                break;
        }
    }

    getInsertFor(tableName) {
        switch (tableName) {
        case 'event':
            return `INSERT INTO events (taskId, type, createdAt, ownerId, status)
            VALUES (?, ?, datetime('now', 'utc'), ?, ?)`;
                break;
            default:
                break;
        }
    }

    getDateTimeFrom(dateTime) {
        return dateTime;
    }
}

module.exports = ScrumDAO
