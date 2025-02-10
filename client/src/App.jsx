import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    socket.on('updateData', (updatedTasks) => updateTask(updatedTasks))
    socket.on('addTask', (task) => addTask(task))
    socket.on('removeTask', (id) => removeTask(id, false));

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateTask = (updatedTasks) => {
    setTasks(updatedTasks);
  }

  const removeTask = (taskID, localAction = true) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.filter(task => task.id !== taskID);
      
      if (localAction) {
        socket.emit('removeTask', taskID);
      }
  
      return newTasks;
    });
  }

  const handleInputChange = (e) => {
    setTaskName(e.target.value);
  };
  
  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  }

  const submitForm = (e) => {
    e.preventDefault();
    const payload = {id: uuidv4(), name: taskName};
    addTask(payload);
    socket.emit('addTask', payload);
    setTaskName('');
  }

  return (
    <div className="App">

    <header>
      <h1>ToDoList.app</h1>
    </header>

    <section className="tasks-section" id="tasks-section">
      <h2>Tasks</h2>

      <ul className="tasks-section__list" id="tasks-list">
        {
          tasks.map( task => (
            <li key={task.id} className="task">{task.name} <button className="btn btn--red" onClick={() => removeTask(task.id)}>Remove</button></li>
          ))
        }
      </ul>

      <form id="add-task-form" onSubmit={submitForm}>
        <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={handleInputChange}/>
        <button className="btn" type="submit">Add</button>
      </form>

    </section>
  </div>
  )
}

export default App
