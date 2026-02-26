import { useState } from "react";
import { login } from "../api/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = await login(username, password);
    console.log("SUCCESS:", data);
    onLogin(data.token);
  } catch (err) {
    console.log("ERROR:", err.response);
    setError("Nom ou mot de passe incorrect");
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Se connecter</button>
      {error && <p style={{color: "red"}}>{error}</p>}
    </form>
  );
}