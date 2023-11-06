import { useEffect, useState } from 'react';
import { server } from '../assets/config/axios.config';
import debounce from 'lodash.debounce';

const getTodoList = () => server.get('/todos').then((data) => data.data);

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    setTaskName(e.target.value);
  };

  const todoList = async () => {
    const response = await getTodoList();
    setTodos(response);
  };

  useEffect(() => {
    todoList();
  }, []);

  const handleDelete = async (id) => {
    try {
      await server.delete(`/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (content) => {
    // Implement the edit functionality
  };

  const handleDone = async (todoToMarkAsDone) => {
    try {
      const updatedTodo = { ...todoToMarkAsDone, isCompleted: true };
      await server.put(`/todos/${updatedTodo.id}`, updatedTodo);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error('Error marking task as done:', error);
    }
  };
  const searchTodos = async (query) => {
    try {
      const res = await server.get("/todos", {
        params: { q: query },
      });
      setTodos(res.data);
    } catch (error) {
      console.error("Error", error);
    }
  };
  useEffect(() => {
    const delay = 2000;
    const debounce = setTimeout(() => {
      if (searchQuery == "") {
        todoList();
      } else {
        searchTodos(searchQuery);
      }
    }, delay);
    return () => {
      clearTimeout(debounce);
    };
  }, [searchQuery]);


  const addTask = async (e) => {
    e.preventDefault();
    try {
      await server.post('/todos', {
        taskName,
        isCompleted: false,
      });
      setTaskName(''); 
      todoList(); 
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="todolist">
      <div className="search" onSubmit={addTask}>
        <input type="text" placeholder="Search ex: todo 1" />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos?.map((todo, id) => (
          <div
            key={id}
            className={`list ${todo.isCompleted ? 'completed' : ''}`}
          >
            <p> {todo.taskName}</p>
            <div className="span-btns">
              {!todo.isCompleted && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete"
              >
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleEdit(todo)}
                title="edit"
              >
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
