import { useState, useEffect } from "react";
import {
  getTrainer,
  updateTrainer,
  deleteTrainer,
  markPokemon,
} from "../api/api";

export default function Trainer({ onLogout }) {
  const [trainer, setTrainer] = useState(null);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const data = await getTrainer();
        setTrainer(data);
        setNewName(data.trainerName); // préremplir le champ
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer le dresseur");
      }
    };
    fetchTrainer();
  }, []);

  const handleUpdate = async () => {
    try {
      const updated = await updateTrainer({ trainerName: newName });
      setTrainer(updated);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Supprimer le dresseur ?")) return;
    try {
      await deleteTrainer();
      onLogout(); // retourne à la page login
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  const handleMarkPokemon = async (pkmnId, isCaptured) => {
    try {
      const updated = await markPokemon(pkmnId, isCaptured);
      setTrainer(updated);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Impossible de marquer le Pokémon");
    }
  };

  if (!trainer) return <p>Chargement...</p>;

  return (
    <div>
      <h2>{trainer.trainerName}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "1em" }}>
        <button onClick={onLogout} style={{ marginBottom: "1em" }}>
            Déconnexion
        </button>

        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleUpdate}>Mettre à jour</button>
        <button onClick={handleDelete} style={{ marginLeft: "1em" }}>
          Supprimer le dresseur
        </button>
      </div>

      <h3>Pokémon vus</h3>
      <ul>
        {trainer.pkmnSeen.map((pkmn) => (
          <li key={pkmn._id}>
            {pkmn.name}{" "}
            <button onClick={() => handleMarkPokemon(pkmn._id, true)}>
              Capturer
            </button>
          </li>
        ))}
      </ul>

      <h3>Pokémon capturés</h3>
      <ul>
        {trainer.pkmnCatch.map((pkmn) => (
          <li key={pkmn._id}>
            {pkmn.name}{" "}
            <button onClick={() => handleMarkPokemon(pkmn._id, false)}>
              Marquer comme vu
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}