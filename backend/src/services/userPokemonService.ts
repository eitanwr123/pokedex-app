import { NewUserPokemon, Pokemon } from "../db/schema";
import { getAllPreEvolutions } from "../utils/getAllPreEvolutions";
import { IUserPokemonRepository } from "../repositories/interfaces/IUserPokemonRepository";
import { IPokemonRepository } from "../repositories/interfaces/IPokemonRepository";
import { PokemonQuery } from "../schemas/filterSchema";
import { PaginatedResponse } from "../schemas/pagination";

export interface UserCollectionQuery extends PokemonQuery {
  userId: number;
}

export class UserPokemonService {
  constructor(
    private _pokemonRepository: IPokemonRepository,
    private _userPokemonRepository: IUserPokemonRepository
  ) {}

  async catchOrReleasePokemon(
    userId: number,
    pokemonId: number
  ): Promise<NewUserPokemon> {
    const userPokemon = { userId, pokemonId };
    let result: NewUserPokemon[];

    const { pokemon: userCollection } =
      await this._pokemonRepository.findPokemonByUserId(userId, 0, 10000);
    const pokemonInCollection = userCollection.find((p) => p.id === pokemonId);

    //check for pre evolutions
    const preEvolutionsIds = await getAllPreEvolutions(pokemonId, (id) =>
      this._pokemonRepository.findPokemonById(id)
    );

    // Build list of pokemon to catch/release (including pre-evolutions)
    let userPokemons: NewUserPokemon[];
    if (preEvolutionsIds.length > 0) {
      userPokemons = preEvolutionsIds
        .filter((id) => !userCollection.find((p) => p.id === id))
        .map((id) => ({ userId, pokemonId: id }));
      //add the original pokemon to the list
      userPokemons.push(userPokemon);
    } else {
      userPokemons = [userPokemon];
    }

    if (pokemonInCollection) {
      result =
        await this._userPokemonRepository.removePokemonFromUserCollection(
          userPokemon
        );
      if (result.length === 0) {
        throw new Error("Failed to release Pokemon from collection");
      }
      console.log(`pokemon ${pokemonId} released`);
    } else {
      result = await this._userPokemonRepository.addPokemonToUserCollection(
        userPokemons
      );
      if (result.length === 0) {
        throw new Error("Failed to catch Pokemon to collection");
      }
      console.log(`pokemon ${pokemonId} caught`);
    }
    //return the pokemon that was caught or released
    return result[0];
  }

  async getUserCollection(
    query: UserCollectionQuery
  ): Promise<PaginatedResponse<Pokemon>> {
    const offset = (query.page - 1) * query.limit;

    const { pokemon, total } =
      await this._pokemonRepository.findPokemonByUserId(
        query.userId,
        offset,
        query.limit,
        query.type,
        query.name,
        query.evolutionTier,
        query.description
      );

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: pokemon,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };
  }
}
