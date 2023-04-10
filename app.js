const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const dbConfig = {
  host: 'amin.mysql.database.azure.com',
  user: 'amin',
  password: 'Qwerty@111',
  database: 'train',
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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
