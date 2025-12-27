import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleCatchPokemon } from "../services/pokemonService";

export function useTogglePokemon() {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: (pokemonId: number) => toggleCatchPokemon(pokemonId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["collection"],
        exact: false,
      });

      await queryClient.invalidateQueries({
        queryKey: ["pokemon"],
        exact: false,
      });
    },
    onError: (error) => {
      console.error("Failed to toggle Pokemon:", error);
    },
  });

  const handleToggle = (pokemonId: number) => {
    toggleMutation.mutate(pokemonId);
  };

  return {
    handleToggle,
    isToggling: toggleMutation.isPending,
    toggleError: toggleMutation.error,
  };
}
