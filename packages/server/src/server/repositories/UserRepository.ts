import { LoginUserDTO } from "../models/DTO/UserDTO"

export default class UserRepository {
  constructor() {}

  public getById(id: string) {
    return "get by id"
  }

  public userAuthentification(loginUser: LoginUserDTO) {
    return "user authentification"
  }
}