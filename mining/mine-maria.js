const mariadb = require('mariadb');

require('dotenv').load();

// configuration environment variables
const databaseUser = process.env.MARIADB_USER
const databasePassword = process.env.MARIADB_PW
const databaseHost = process.env.MARIADB_HOST

mariadb.createConnection({host: databaseHost, user: databaseUser, password: databasePassword, port: 3307})
  .then(conn => {
    conn.query("select 1", [2])
      .then(rows => {
        console.log(rows); // [{ "1": 1 }]
        conn.end();
      })
      .catch(err => { 
        console.log(err)//handle query error
      });
  })
  .catch(err => {
    console.log(err)
  });

