
import React, { useState } from "react";
import TodoList from "./components/TodoList";
import Login from "./components/Login";

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <TodoList />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
