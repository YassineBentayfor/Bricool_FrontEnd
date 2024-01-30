import {UserDetails} from "./UserDetails";

export interface SignInResponse {
  token: string;
  user: UserDetails; // Utilisez l'interface UserDetails que vous avez définie précédemment
}
