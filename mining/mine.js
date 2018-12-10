const Promise         = require('bluebird')
const winston         = require('winston')

const TaskMiner       = require('./airtable')

//const Doa             = require('./../shared/doa')
const Doa             = require('./../shared/doa-mariadb')
const logger          = require('./../shared/logger')
const EventRepository = require('./../shared/datamodel/event_repository')
const TaskRepository  = require('./../shared/datamodel/task_repository')
const Task            = require('./../shared/datamodel/pojos/Task')
const Event           = require('./../shared/datamodel/pojos/Event')

require('dotenv').load();

function main() {

    let logToFile = false;
    let unknown = [];

    process.argv.forEach(function (val, index, array) {
        switch (val) {
        case '--log-to-file':
            logToFile = true;
            break;
        default:
            if (index > 1) {
                unknown.push(val)
            }
            break;
        }
    });

    // configuration environment variables
    const airTableKey = process.env.AIR_TABLE_API_KEY
    const airTableBase = process.env.AIR_TABLE_BASE
    const airTableTable = process.env.AIR_TABLE_TABLE
    const airTableView = process.env.AIR_TABLE_VIEW

    if (logToFile) {
        logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }))
        logger.add(new winston.transports.File({ filename: 'combined.log' }))
    } else {
        logger.add(new winston.transports.Console())
    }

    unknown.forEach((arg) => {
        logger.warn('Unknown argument: ' + arg)
    })

    // setup or open database
    //const dbHandle = new Doa('./database.sqlite3')
    const databaseUser = process.env.MARIADB_USER
    const databasePassword = process.env.MARIADB_PW
    const databaseHost = process.env.MARIADB_HOST
    const databaseDatabase = process.env.MARIADB_DB
    const dbHandle = new Doa(databaseHost, databaseDatabase, databaseUser, databasePassword, 3307)


    taskRepo = new TaskRepository(dbHandle);
    eventRepo = new EventRepository(dbHandle);

    miner = new TaskMiner(airTableKey, airTableBase, airTableTable, airTableView)

    taskRepo.createTable()
    .then(() => eventRepo.createTable() )
    .then(() => miner.getAllTasks())
    .then((tasks) => {
        return Promise.all(tasks.map((task) => {
            return taskRepo.find(task.id).then((dbt) => {
                return {dbtask: dbt, task: task}
            })
        }))
    })
    .then((tupleArray) => {
        return Promise.all(tupleArray.reduce((events, pair) => {
            if (!pair.dbtask) {
                const task = new Task(pair.task, dbHandle.getDateTimeFrom)
                logger.info('Found new task with id ' + pair.task.id)
                // insert task, generate 'detected event'

                let insertPromise = taskRepo.create(task).then(() => {
                    return eventRepo.create(new Event(task.id, 'INSERTED', task.owner, task.status))
                })
                events.push(insertPromise)
            } else {
                const pojoEvents = generateChangeEvents(new Task(pair.task, dbHandle.getDateTimeFrom), new Task(pair.dbtask))

                if (pojoEvents.length > 0) {
                    events.push(taskRepo.update(new Task(pair.task, dbHandle.getDateTimeFrom)).then(() => {
                        return Promise.all(pojoEvents.map((e) => {
                            return eventRepo.create(e)
                        }))
                    }))
                }
            }
            return events
        }, []))
    })
    .then(flattenDeep)
    .then((events) => {
        logger.info('all done, generated ' + events.length + ' new events.')
        return dbHandle.end()
    })
    .catch((err) => {
        logger.error('Error: ')
        logger.error(JSON.stringify(err))
        dbHandle.end()
    })
}


function flattenDeep(arr1) {
   return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}

function generateChangeEvents(t1, t2, taskRepo) {

    const eventtypes = {
      name: 'NAME', 
      owner: 'OWNER', 
      estimate: 'ESTIMATE',
      status: 'STATUS',
      blocked: 'BLOCKED',
      unplanned: 'UNPLANNED',
      userStoryId: 'USERSTORY',
      createdAt: 'CREATIONTIME'
    }

    return events = ['name', 'owner', 'estimate', 'status', 'blocked', 'unplanned'/*, 'createdAt'*/, 'userStoryId'].reduce((events, attribute) => {
      if (t1[attribute] !== t2[attribute]) {
        events.push(new Event(t1.id, eventtypes[attribute], t1.owner, t1.status))
      }
      return events
    }, [])
}

main()
