import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [toDoItems, setTodoItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  // Get todos from API
  useEffect(() => {
    const fetchToDo = async () => {
      try {
        const data = await fetch(
          "https://playground.4geeks.com/todo/users/Scott"
        );

        if (data.ok) {
          const result = await data.json();
          setTodoItems(result.todo);
        } else {
          await fetch("https://playground.4geeks.com/todo/users/Scott", {
            method: "POST",
          });
          setTodoItems([]);
        }
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };

    fetchToDo();
  }, []);

  const handleAddItem = async () => {
    if (newItem) {
      let task = {
        label: newItem,
        done: false,
      };

      try {
        const data = await fetch(
          "https://playground.4geeks.com/todo/todos/Scott",
          {
            method: "POST",
            body: JSON.stringify(task),
            headers: { "Content-type": "application/json" },
          }
        );
        const result = await data.json();

        setTodoItems([...toDoItems, result]);
        setNewItem("");
      } catch (err) {
        console.error("Error adding todo:", err);
      }
    }
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  const handleDeleteItem = async (index) => {
    try {
      await fetch(
        `https://playground.4geeks.com/todo/todos/${toDoItems[index].id}`,
        {
          method: "DELETE",
        }
      );
      setTodoItems(toDoItems.filter((_, idx) => idx !== index));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleUpdateTodo = async (index) => {
    const updatedTodo = {
      label: toDoItems[index].label,
      is_done: !toDoItems[index].is_done,
    };

    try {
      const data = await fetch(
        `https://playground.4geeks.com/todo/todos/${toDoItems[index].id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedTodo),
          headers: { "Content-type": "application/json" },
        }
      );
      const result = await data.json();
      const updatedItems = [...toDoItems];
      updatedItems[index] = result;
      setTodoItems(updatedItems);
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4">Todo List</h2>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Add a new item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleKeypress}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleAddItem}
              >
                Add
              </button>
            </div>
          </div>
          <ul className="list-group">
            {toDoItems?.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {item.label}
                <button
                  className="btn btn-danger btn-sm mx-5"
                  onClick={() => handleDeleteItem(index)}
                >
                  Delete
                </button>
                <input
                  type="checkbox"
                  onChange={() => handleUpdateTodo(index)}
                  checked={item.is_done}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
