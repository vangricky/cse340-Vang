/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const { Pool } = require('pg');
const baseController = require("./controllers/baseController")

/* ***********************
 * Routes
 * View Engine and Templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');
app.use(static)

//Index Route
// app.get("/", function(req, res){
//   res.render("index", {title: "Home"})
// })

app.get('/', baseController.buildHome)

app.get('/db/test', (req,res) => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: false
  });

  pool.query('SELECT * FROM inventory', (err, res) => {
    if (err) {
      res.send(`Error: ${err}`);
    } else {
      res.send(`<pre>${JSON.stringify(queryRes.rows, null, 4)}</pre>`)
    }
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`)
})
