import { useState } from "react";
import { registerTrainer } from "../api/api";

export default function Register({ onRegister, onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Le nom et le mot de passe sont obligatoires");
      return;
    }

    try {
      setLoading(true);
      // On envoie exactement ce que le backend attend
      const newTrainer = await registerTrainer({ username, password });
      onRegister(newTrainer); // connexion automatique
    } catch (err) {
      console.error("Erreur inscription :", err.response || err);
      setError("Erreur lors de l'inscription. Vérifie le nom et le mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Créer un compte</h2>

        {error && <p className="auth-error">{error}</p>}

        <input
          placeholder="Nom du dresseur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Création..." : "S'inscrire"}
        </button>

        <button onClick={onSwitch} className="auth-switch">
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  );
}