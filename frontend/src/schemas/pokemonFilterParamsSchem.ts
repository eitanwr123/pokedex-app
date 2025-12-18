import { z } from "zod";

export const pokemonFilterParameterSchema = z.object({
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
export type PokemonFilterParams = z.infer<typeof pokemonFilterParameterSchema>;

export const paginationAndFilterSchema = pokemonFilterParameterSchema.extend({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Page must be a positive number",
    }),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
      message: "Limit must be a positive number between 1 and 100",
    }),
});
export type PaginationAndFilterParams = z.infer<
  typeof paginationAndFilterSchema
>;
