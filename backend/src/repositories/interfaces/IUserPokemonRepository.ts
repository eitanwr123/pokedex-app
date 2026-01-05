import { NewUserPokemon } from "../../db/schema";

export interface IUserPokemonRepository {
  addPokemonToUserCollection(
    input: NewUserPokemon | NewUserPokemon[]
  ): Promise<NewUserPokemon[]>;

  removePokemonFromUserCollection(
    input: NewUserPokemon | NewUserPokemon[]
  ): Promise<NewUserPokemon[]>;
}
