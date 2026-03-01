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
  <div className="trainer-container">
    <div className="trainer-card">
      <div className="trainer-header">
        <div className="trainer-avatar">
          {trainer.trainerName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>Bienvenue</h2>
          <h3>{trainer.trainerName}</h3>
        </div>
      </div>

      {error && <p className="trainer-error">{error}</p>}

      <div className="trainer-section">
        <h4>Modifier le nom</h4>
        <div className="trainer-edit">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            className="primary"
            onClick={handleUpdate}
            disabled={loading}
          >
            Mettre à jour
          </button>
        </div>
      </div>

      <div className="trainer-actions">
        <button className="logout" onClick={onLogout}>
          Déconnexion
        </button>
        <button className="danger" onClick={handleDelete}>
          Supprimer le dresseur
        </button>
      </div>
    </div>
  </div>
);
}