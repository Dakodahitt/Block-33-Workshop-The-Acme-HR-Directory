const pg = require("pg");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const { Client } = pg;
const client = new Client({
  connectionString:
    process.env.DATABASE_URL || "postgres://localhost/acme_hr_directory",
});

app.use(express.json());
app.use(require("morgan")("dev"));

app.get("/api/employees", async (req, res, next) => {
  try {
    const SQL = `SELECT * FROM employees`;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});
app.get("/api/departments", async (req, res, next) => {
  try {
    const SQL = `SELECT * FROM departments`;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});
app.post("/api/employees", async (req, res, next) => {
  try {
    const { name, department_id } = req.body;
    const SQL = `
        INSERT INTO employees(name, department_id)
        VALUES($1, $2)
        RETURNING *`;
    const response = await client.query(SQL, [name, department_id]);
    res.send(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const SQL = `
        DELETE FROM employees
        WHERE id=$1`;
    await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});
app.puy("/api/employees/:id", async (req, res, next) => {
  try {
    const { name, department_id } = req.body;
    const SQL = `
            UPDATE employees
            SET name=$1, department_id=$2
            WHERE id=$3
            RETURNING *`;
    const response = await client.query(SQL, [
      name,
      department_id,
      req.params.id,
    ]);
    res.send(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});
