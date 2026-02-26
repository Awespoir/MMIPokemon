// src/components/Pokedex.js
import { useState, useEffect } from "react";
import { searchPokemon } from "../api/api"; // Assure-toi que cette fonction appelle /api/pkmn/search

export default function Pokedex() {
  const [pokemons, setPokemons] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [size] = useState(20); // Pokémon par page
  const [loading, setLoading] = useState(false);

  // Fonction pour récupérer les Pokémon
  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const result = await searchPokemon({ partialName: query, page, size });
      setPokemons(result.data);
      setTotalCount(result.count);
    } catch (err) {
      console.error("Erreur fetchPokemons:", err);
    }
    setLoading(false);
  };

  // Appelle fetchPokemons quand query ou page change
  useEffect(() => {
    fetchPokemons();
  }, [query, page]);

  // Pagination
  const totalPages = Math.ceil(totalCount / size);

  return (
    <div>
      <h2>Pokédex</h2>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher un Pokémon..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1); // Reset page à 1 pour une nouvelle recherche
        }}
      />

      {loading && <p>Chargement...</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {pokemons.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "0.5rem",
              width: "150px",
              textAlign: "center",
            }}
          >
            <img
              src={p.imgUrl}
              alt={p.name}
              style={{ width: "100px", height: "100px" }}
            />
            <h4>{p.name}</h4>
            <p style={{ fontSize: "0.8rem" }}>{p.types.join(", ")}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            {"<"} Précédent
          </button>
          <span style={{ margin: "0 1rem" }}>
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Suivant {">"}
          </button>
        </div>
      )}
    </div>
  );
}