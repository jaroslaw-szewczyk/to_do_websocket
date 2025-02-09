const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const tasks = [];


app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).send('<img src=\"not-found.jpg\" />');
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});