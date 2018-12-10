// Data Access Object

const mariadb = require('mariadb');
const Promise = require('bluebird')
const logger = require('./logger')

class ScrumDAO {
    constructor(host, database, user, password, port = 3306) {
        this.conn = mariadb.createConnection({
            host: host,
            database: database,
            user: user,
            password: password,
            port: port
        })
    }

    run(sql, params = []) {
        return this.conn.then((conn) => {
            return conn.query(sql, params);
        })
    }

    get(sql, params = []) {
        return this.conn.then((conn) => {
            return conn.query(sql, params).then((rows) => {
                if (Array.isArray(rows) && rows.length > 0)
                    return rows[0];
                else {
                    return null;
                }
            });
        })
    }

    end() {
        return this.conn.then((conn) => {
            return conn.end()
        })
    }

    getInsertFor(tableName) {
        switch (tableName) {
        case 'event':
            return `INSERT INTO events (taskId, type, createdAt, ownerId, status)
                VALUES (?, ?, UTC_TIMESTAMP(), ?, ?)`;
            break;
            default:
                break;
        }
    }

    getCreateFor(tableName) {
        switch (tableName) {
            case 'tasks':
                return `
                CREATE TABLE IF NOT EXISTS tasks (
                    id VARCHAR(64) PRIMARY KEY,
                    name TEXT,
                    owner VARCHAR(64),
                    estimate TEXT,
                    status TEXT,
                    blocked INTEGER,
                    unplanned INTEGER,
                    createdAt DATETIME,
                    userStoryId VARCHAR(64)
                  )`
                break;
        
            case 'events':
                return `
                CREATE TABLE IF NOT EXISTS events (
                    id INTEGER PRIMARY KEY AUTO_INCREMENT,
                    taskId VARCHAR(64),
                    type TEXT,
                    createdAt DATETIME,
                    ownerId VARCHAR(64),
                    status TEXT,
                    CONSTRAINT tasks_fk_taskId FOREIGN KEY (taskId)
                      REFERENCES tasks(id) ON UPDATE CASCADE ON DELETE CASCADE)`
                break;
            default:
                break;
        }
    }

    getDateTimeFrom(dateTime) {
        return new Date(dateTime).toISOString().slice(0, 19).replace('T', ' ');
    }
}

module.exports = ScrumDAO
