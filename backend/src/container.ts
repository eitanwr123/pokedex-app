import { IPokemonRepository } from "./repositories/interfaces/IPokemonRepository";
import { IUserPokemonRepository } from "./repositories/interfaces/IUserPokemonRepository";
import { IUserRepository } from "./repositories/interfaces/IUserRepository";
import { PokemonRepositoryImpl } from "./repositories/PokemonRepositoryImpl";
import { UserPokemonRepositoryImpl } from "./repositories/userPokemonRepositorylmpl";
import { UserRepositoryImpl } from "./repositories/UserRepositoryImpl";
import { AuthService } from "./services/authService";
import { PokemonService } from "./services/pokemonService";
import { UserPokemonService } from "./services/userPokemonService";

export class Container {
  private _userRepository?: IUserRepository;
  private _pokemonRepository?: IPokemonRepository;
  private _userPokemonRepository?: IUserPokemonRepository;
  private _authService?: AuthService;
  private _pokemonService?: PokemonService;
  private _userPokemonService?: UserPokemonService;

  getUserRepository(): IUserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepositoryImpl();
    }
    return this._userRepository;
  }

  getPokemonRepository(): IPokemonRepository {
    if (!this._pokemonRepository) {
      this._pokemonRepository = new PokemonRepositoryImpl();
    }
    return this._pokemonRepository;
  }

  getUserPokemonRepository(): IUserPokemonRepository {
    if (!this._userPokemonRepository) {
      this._userPokemonRepository = new UserPokemonRepositoryImpl();
    }
    return this._userPokemonRepository;
  }

  getAuthService(): AuthService {
    if (!this._authService) {
      this._authService = new AuthService(this.getUserRepository());
    }
    return this._authService;
  }

  getPokemonService(): PokemonService {
    if (!this._pokemonService) {
      this._pokemonService = new PokemonService(this.getPokemonRepository());
    }
    return this._pokemonService;
  }

  getUserPokemonService(): UserPokemonService {
    if (!this._userPokemonService) {
      this._userPokemonService = new UserPokemonService(
        this.getPokemonRepository(),
        this.getUserPokemonRepository()
      );
    }
    return this._userPokemonService;
  }
}

export const appContainer = new Container();
