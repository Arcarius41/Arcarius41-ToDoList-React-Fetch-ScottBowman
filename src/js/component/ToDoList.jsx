import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  // Fetch todos from API
  useEffect(() => {
    const fetchToDo = async () => {
      try {
        const response = await fetch(
          "https://playground.4geeks.com/todo/users/Arcarius"
        );
        if (response.ok) {
          const result = await response.json();
          setTodoItems(result.todos || []);
        } else {
          await fetch("https://playground.4geeks.com/todo/users/Arcarius", {
            method: "POST",
            body: JSON.stringify([]),
            headers: { "Content-type": "application/json" },
          });
          setTodoItems([]);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchToDo();
  }, []);

  const handleAddItem = async () => {
    if (newItem.trim()) {
      try {
        const task = { label: newItem, done: false };
        const response = await fetch(
          "https://playground.4geeks.com/todo/todos/Arcarius",
          {
            method: "POST",
            body: JSON.stringify(task),
            headers: { "Content-type": "application/json" },
          }
        );
        const result = await response.json();
        setTodoItems([...todoItems, result]);
        setNewItem("");
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  const handleDeleteItem = async (index) => {
    try {
      const item = todoItems[index];
      await fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
        method: "DELETE",
      });
      setTodoItems(todoItems.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleUpdateTodo = async (index) => {
    try {
      const updatedTodo = {
        label: todoItems[index].label,
        done: !todoItems[index].done,
      };

      const response = await fetch(
        `https://playground.4geeks.com/todo/todos/${todoItems[index].id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedTodo),
          headers: { "Content-type": "application/json" },
        }
      );
      const result = await response.json();
      const updatedTodos = [...todoItems];
      updatedTodos[index] = result;
      setTodoItems(updatedTodos);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4"></h2>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Add a new item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleKeypress}
            />
            <button
              className="btn btn-outline-secondary"
              onClick={handleAddItem}
            >
              Add
            </button>
          </div>
          <ul className="list-group">
            {todoItems.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {item.label}
                <div>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => handleDeleteItem(index)}
                  >
                    Delete
                  </button>
                  <input
                    type="checkbox"
                    onChange={() => handleUpdateTodo(index)}
                    checked={item.done}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoList;