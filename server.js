const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, 'client/dist')));

const tasks = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.use((req, res) => {
  res.status(404).send('<img src=\"not-found.jpg\" />');
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
 
  socket.emit('updateData', tasks);

  socket.on('addTask', task => {
    users.push({id: task.id ,name: task.name});
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', taskID => { 
    const task = tasks.findIndex( myTask => myTask.id === taskID);
    if(task) {
      users.splice(index, 1);
      socket.broadcast.emit('removeTask', taskID);
    }
   });

});