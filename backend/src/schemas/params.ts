import { z } from "zod";

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a valid number")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, {
      message: "ID must be a positive number",
    }),
});

export const catchReleasePokemonParamSchema = z.object({
  pokemonId: z.number().int().positive({
    message: "Pokemon ID must be a positive integer",
  }),
});
