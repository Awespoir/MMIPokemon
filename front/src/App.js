import { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login";
import Pokedex from "./components/Pokedex";
import Trainer from "./components/Trainer";
import { setToken, getTrainer } from "./api/api";
import Register from "./components/Register";

function App() {
  const [tokenState, setTokenState] = useState(localStorage.getItem("token"));
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegister, setIsRegister] = useState(false);

  // Récupère le trainer au chargement si token existe
  useEffect(() => {
    const fetchTrainer = async () => {
      if (!tokenState) {
        setTrainer(null);
        setLoading(false);
        return;
      }
      try {
        const data = await getTrainer();
        setTrainer(data);
      } catch (err) {
        console.error(err);
        // si token invalide -> déconnecter
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [tokenState]);

  const handleLogin = (token) => {
    setToken(token);        // update api.js
    setTokenState(token);   // update App state
  };

  const handleLogout = () => {
    setToken(null);         // supprime token dans api.js et localStorage
    setTokenState(null);    // reset App state
    setTrainer(null);
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="App">
      {!tokenState ? (
  isRegister ? (
    <Register
      onRegister={handleLogin}
      onSwitch={() => setIsRegister(false)}
    />
  ) : (
    <Login
      onLogin={handleLogin}
      onSwitch={() => setIsRegister(true)}
    />
  )
) : (
  <div>
    <Trainer trainer={trainer} onLogout={handleLogout} setTrainer={setTrainer} />
    <Pokedex
  trainer={trainer}
  setTrainer={setTrainer}
/>
  </div>
)}
</div>
  );
}

export default App; 