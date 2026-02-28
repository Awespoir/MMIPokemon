// src/components/Pokedex.js
import { useState, useEffect } from "react";
import { searchPokemon, markPokemon } from "../api/api";

const typeColors = {
  grass: "#78C850",
  fire: "#F08030",
  water: "#6890F0",
  poison: "#A040A0",
  flying: "#A890F0",
  electric: "#F8D030",
  ground: "#E0C068",
  rock: "#B8A038",
  bug: "#A8B820",
  normal: "#A8A878",
  fairy: "#EE99AC",
  fighting: "#C03028",
  psychic: "#F85888",
  ice: "#98D8D8",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
};

export default function Pokedex({ trainer, setTrainer }) {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all | seen | captured
  const [selectedPokemon, setSelectedPokemon] = useState(null); // Pokémon plein écran
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);


  const pageSize = 20;

  useEffect(() => {
    fetchPokemons();
  }, [search, page]);

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const res = await searchPokemon({ partialName: search, page, size: pageSize });
      setPokemons(res.data);
      setTotal(res.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Interaction Vu / Capturé
  const handleInteraction = async (pkmnId, action) => {
    try {
      let isCaptured;
      if (action === "capture") isCaptured = true;
      else if (action === "seen") isCaptured = false;

      const updatedTrainer = await markPokemon(pkmnId, isCaptured);
      setTrainer(updatedTrainer);
    } catch (err) {
      console.error("Erreur interaction Pokémon :", err);
    }
  };

 const renderCard = (p) => {
  const seen = trainer?.pkmnSeen?.includes(p._id);
  const captured = trainer?.pkmnCatch?.includes(p._id);
  const isSelected = selectedPokemonId === p._id;

  return (
    <div
      className="pkmn-card"
      key={p._id}
      onClick={() => captured && setSelectedPokemonId(isSelected ? null : p._id)}
    >
      <img
        src={p.imgUrl}
        alt={p.name}
        className={!seen ? "silhouette" : ""}
      />

      <h4>{seen ? p.name : "???"}</h4>

      {/* Panneau infos Pokémon capturé, reste dans la carte */}
      <div
        className="selected-info"
        style={{
          maxHeight: captured && isSelected ? "220px" : "0",
          opacity: captured && isSelected ? 1 : 0,
        }}
      >
        {captured && isSelected && (
          <>
            <p>{p.description}</p>
            <div className="types">
              {p.types.map((t) => (
                <span
                  key={t}
                  style={{
                    background: typeColors[t],
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    margin: "2px",
                    fontSize: "13px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Boutons interaction toujours présents */}
      <div className="actions">
        {!seen && (
          <button onClick={() => handleInteraction(p._id, "seen")}>
            👁 Vu
          </button>
        )}
        {seen && !captured && (
          <button onClick={() => handleInteraction(p._id, "capture")}>
            🎯 Capturer
          </button>
        )}
      </div>
    </div>
  );
};

  // Filtrage selon bouton
  const filteredPokemons = pokemons.filter((p) => {
    const seen = trainer?.pkmnSeen?.includes(p._id);
    const captured = trainer?.pkmnCatch?.includes(p._id);

    if (filter === "seen") return seen && !captured;
    if (filter === "captured") return captured;
    return true;
  });

  return (
    <div className="pokedex">
      <h2>POKÉDEX</h2>

      <div className="filters">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
          Tous
        </button>
        <button className={filter === "seen" ? "active" : ""} onClick={() => setFilter("seen")}>
          Vu
        </button>
        <button className={filter === "captured" ? "active" : ""} onClick={() => setFilter("captured")}>
          Capturés
        </button>
      </div>

      <input
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid">
          {filteredPokemons.map(renderCard)}
        </div>
      )}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>←</button>
        <span>{page} / {Math.ceil(total / pageSize)}</span>
        <button disabled={page * pageSize >= total} onClick={() => setPage(page + 1)}>→</button>
      </div>

      {/* Pokémon plein écran */}
      {selectedPokemon && (
        <div className="pkmn-fullscreen" onClick={() => setSelectedPokemon(null)}>
          <div className="pkmn-info">
            <img src={selectedPokemon.imgUrl} alt={selectedPokemon.name} />
            <h2>{selectedPokemon.name}</h2>
            <p>{selectedPokemon.description}</p>
            <div>
              {selectedPokemon.types.map((t) => (
                <span
                  key={t}
                  style={{
                    background: typeColors[t],
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    margin: "2px",
                    fontSize: "14px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}