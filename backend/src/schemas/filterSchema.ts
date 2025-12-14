import { z } from "zod";
import { paginationSchema } from "./pagination";

export const pokemonFilterSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  evolutionTier: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (val > 0 && val <= 3), {
      message: "Evolution tier must be 1, 2, or 3",
    }),
});

// Combined schema: pagination + filters
export const pokemonQuerySchema = paginationSchema.extend(
  pokemonFilterSchema.shape
);
export type PokemonFilters = z.infer<typeof pokemonFilterSchema>;
export type PokemonQuery = z.infer<typeof pokemonQuerySchema>;
