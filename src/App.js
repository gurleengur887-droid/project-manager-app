import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLogin, setIsLogin] = useState(true);

  if (!token) {
    return isLogin ? (
      <Login setToken={setToken} switchToRegister={() => setIsLogin(false)} />
    ) : (
      <Register switchToLogin={() => setIsLogin(true)} />
    );
  }

  return <Dashboard />;
}

export default App;