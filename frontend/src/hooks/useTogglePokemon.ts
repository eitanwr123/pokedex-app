import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePokemon } from "../services/pokemonService";
import { useCallback } from "react";

export function useTogglePokemon() {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: (pokemonId: number) => togglePokemon(pokemonId),
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

  const handleToggle = useCallback(
    (pokemonId: number) => {
      toggleMutation.mutate(pokemonId);
    },
    [toggleMutation.mutate]
  );

  return {
    handleToggle,
    isToggling: toggleMutation.isPending,
    toggleError: toggleMutation.error,
  };
}
