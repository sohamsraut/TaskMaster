"use strict";

const express = require("express");
const multer = require("multer");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// for application/json
app.use(express.json());

// for multipart/form-data (required with FormData)
app.use(multer().none());

app.post("/tasks/all", async (req, res) => {
  try {
    let user = req.body.username;
    let pass = req.body.pass;
    let db = await getDBConnection();
    let query = "SELECT * FROM users where username=?;";
    let result = await db.all(query, user);
    await db.close();
    if (result.length != 0 && pass === result[0]["pass"]){
      let tasks = await getUserTasks(result[0]["userid"]);
      res.json(tasks);
    } else {
      res.status(400).send("Wrong username or password.")
    }
  } catch(err) {
    res.status(500).send("Internal server error");
  }

});

app.post("/tasks/delete", async (req, res) => {
  try {
    let user = req.body.user;
    let taskId = req.body.taskId
    let db = await getDBConnection();
    let query = "DELETE from tasks where user=? and taskId=?";
    let result = await db.run(query, [user, taskId]);
    await db.close();
    res.type("text");
    res.send("Task deleted.");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

async function getUserTasks(userId) {
  let db = await getDBConnection();
  let query = "Select * from tasks where user = ?;";
  let res = db.all(query, userId);
  await db.close();
  return res;
}

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
 async function getDBConnection() {
  const db = await sqlite.open({
    filename: "tasks.db",
    driver: sqlite3.Database
  });

  return db;
}

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);