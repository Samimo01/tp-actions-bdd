const { Client } = require("pg");

async function getConnection() {
  const client = new Client({
    host: "localhost",
    database: "tp",
    user: "postgres",
    password: "postgres",
  });
  await client.connect();
  return client;
}

async function addStudent(client, name, grade) {
  const res = await client.query(
    "INSERT INTO students (name, grade) VALUES ($1, $2) RETURNING id",
    [name, grade]
  );
  return res.rows[0].id;
}

async function getStudent(client, id) {
  const res = await client.query(
    "SELECT name, grade FROM students WHERE id = $1",
    [id]
  );
  if (res.rows.length === 0) return null;
  return { name: res.rows[0].name, grade: parseFloat(res.rows[0].grade) };
}

async function averageGrade(client) {
  const res = await client.query(
    "SELECT COALESCE(AVG(grade), 0) AS avg FROM students"
  );
  return parseFloat(res.rows[0].avg);
}

module.exports = { getConnection, addStudent, getStudent, averageGrade };
