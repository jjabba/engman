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
}

module.exports = ScrumDAO
