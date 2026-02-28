import { useState, useEffect } from "react";
import {
  updateTrainer,
  deleteTrainer,
  markPokemon,
  
} from "../api/api";

export default function Trainer({ trainer, setTrainer, onLogout }) {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Préremplir le champ quand trainer change
  useEffect(() => {
    if (trainer) {
      setNewName(trainer.trainerName);
    }
  }, [trainer]);



  const handleUpdate = async () => {
    if (!newName.trim()) {
      setError("Le nom ne peut pas être vide");
      return;
    }

    try {
      setLoading(true);
      const updated = await updateTrainer({ trainerName: newName });
      setTrainer(updated);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Supprimer le dresseur ?")) return;

    try {
      await deleteTrainer();
      onLogout();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  const handleMarkPokemon = async (pkmnId, isCaptured) => {
    try {
      setLoading(true);
      const updated = await markPokemon(pkmnId, isCaptured);
      setTrainer(updated);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Impossible de marquer le Pokémon");
    } finally {
      setLoading(false);
    }
  };

  if (!trainer) return <p>Aucun dresseur trouvé</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bienvenue {trainer.trainerName}</h2>

      <button onClick={onLogout} style={{ marginBottom: "15px" }}>
         Déconnexion
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <h3>Modifier le nom</h3>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleUpdate} disabled={loading}>
          Mettre à jour
        </button>
        <button
          onClick={handleDelete}
          style={{ marginLeft: "10px", color: "red" }}
        >
          Supprimer le dresseur
        </button>
        
      </div>
    </div>
  );
}