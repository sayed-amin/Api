const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  }
};

async function getSeats() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute('SELECT * FROM seats');
  connection.end();
  return rows;
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});


app.get('/seats', async (req, res) => {
  try {
    const seats = await getSeats();
    res.json(seats);
  } catch (err) {
    console.error('Error querying database: ', err);
    res.sendStatus(500);
  }
});
app.post('/seats/:seatNumber/reserve', async (req, res) => {
  const { seatNumber } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('UPDATE seats SET is_available = 0 WHERE seat_number = ?', [seatNumber]);
    connection.end();
    res.sendStatus(200);
  } catch (err) {
    console.error(`Error reserving seat ${seatNumber}: `, err);
    res.sendStatus(500);
  }
});
app.put('/seats/clear', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('UPDATE seats SET is_available = 1');
    connection.end();
    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating seats: ', err);
    res.sendStatus(500);
  }
});


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
