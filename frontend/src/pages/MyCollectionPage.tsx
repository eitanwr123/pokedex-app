import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserCollection, toggleCatchPokemon } from "../services/pokemonService";
import PokemonCard from "../components/PokemonCard";

export default function MyCollectionPage() {
  const queryClient = useQueryClient();

  const { data: collectionData, isLoading, error } = useQuery({
    queryKey: ["collection"],
    queryFn: getUserCollection,
  });

  const toggleMutation = useMutation({
    mutationFn: (pokemonId: number) => toggleCatchPokemon(pokemonId),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["collection"] });
    },
  });

  if (isLoading) return <div>Loading your collection...</div>;
  if (error) return <div>Error loading collection!</div>;

  const myPokemon = collectionData?.collection ?? [];

  const handleToggle = (pokemonId: number) => {
    toggleMutation.mutate(pokemonId);
  };

  return (
    <div>
      <h1>My Collection</h1>

      {myPokemon.length === 0 ? (
        <p>You haven't caught any Pokemon yet. Go catch some!</p>
      ) : (
        <>
          <p>You have caught {myPokemon.length} Pokemon!</p>
          {myPokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.name}
              pokemonId={pokemon.id}
              name={pokemon.name}
              type={pokemon.types}
              isCaught={true}
              onToggle={handleToggle}
            />
          ))}
        </>
      )}
    </div>
  );
}
