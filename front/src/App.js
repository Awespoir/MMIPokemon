import { useState } from "react";
import Login from "./components/Login";
import Trainer from "./components/Trainer";
import { setToken } from "./api/api";

function App() {
  const [token, setTokenState] = useState(localStorage.getItem("token") || null);

  const handleLogin = (t) => {
    localStorage.setItem("token", t); // garde le token
    setToken(t); // met à jour l'API axios
    setTokenState(t);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null); // supprime le token côté API
    setTokenState(null); // retour à l'écran login
  };

  return (
    <div className="App">
      {token ? (
        <Trainer onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;