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

    return () => {
      socket.disconnect();
    };
  }, []);

  const removeTask = (taskID) => {
    setTasks(prevTask => prevTask.filter( task => task.id !== taskID));
    socket.emit('removeTask', taskID);
  }

  const handleInputChange = (e) => {
    setTaskName(e.target.value);
  };
  
  const addTask = () => {

  }

  const submitForm = (event) => {
    event.preventDefault();
    console.log({name: taskName, id: uuidv4()})
    addTask({name: taskName, id: uuidv4()});
    socket.emit('addTask', taskName);
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
          tasks.map( task => {
            <li className="task">{task.name} <button className="btn btn--red" onClick={() => removeTask(task.id)}>Remove</button></li>
          })
        }
      </ul>

      <form id="add-task-form" onSubmit={submitForm}>
        <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" onChange={handleInputChange}/>
        <button className="btn" type="submit"e>Add</button>
      </form>

    </section>
  </div>
  )
}

export default App
