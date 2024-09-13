import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [toDoItems, setToDoItems] = useState([]);
  const [newItem, setNewItems] = useState("");

  // Get todos from API
  useEffect(() => {
    const fetchToDO = async () => {
      const data = await fetch(
        "https://playground.4geeks.com/todo/users/Arcarius41"
      );

      if (data.ok) {
        const result = await data.json();
        setToDoItems(result.todos);
      } else {
        await fetch("https://playground.4geeks.com/todo/users/Arcarius41", {
          method: "POST",
        });
        setToDoItems([]);
      }
    };
    fetchToDO();
  }, []);

  const handleAddItem = async () => {
    if (newItem) {
      let task = {
        label: newItem,
        done: false,
      };

      const data = await fetch(
        "https://playground.4geeks.com/todo/todos/Arcarius41",
        {
          method: "POST",
          body: JSON.stringify(task),
          headers: { "Content-type": "application/json" },
        }
      );
      const result = await data.json();

      setToDoItems([...toDoItems, result]);
      setNewItems("");
    }
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  // This procedure has changed
  const handleDeleteItem = async (index) => {
    const data = await fetch(
      `https://playground.4geeks.com/todo/todos/${toDoItems[index].id}`,
      {
        method: "DELETE",
      }
    );
    setToDoItems(toDoItems.toSpliced(index, 1));
  };

  // This procedure has changed
  const handleUpdateTodo = async (index) => {
    const updatedTodo = {
      label: toDoItems[index].label,
      is_done: !toDoItems[index].is_done,
    };

    const data = await fetch(
      `https://playground.4geeks.com/todo/todos/${toDoItems[index].id}`,
      {
        method: "PUT",
        body: JSON.stringify(updatedTodo),
        headers: { "Content-type": "application/json" },
      }
    );
    const result = await data.json();

    setToDoItems(toDoItems.toSpliced(index, 1, result));
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
              onChange={(e) => setNewItems(e.target.value)}
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
