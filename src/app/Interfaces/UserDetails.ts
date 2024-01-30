export interface UserDetails {
  id: number; // Assurez-vous que les types correspondent à ceux de votre backend
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Généralement, le mot de passe n'est pas inclus dans les DTO de l'utilisateur pour des raisons de sécurité
  phoneNumber: string;
  yearsOfBirth: Date | string; // Peut dépendre de la façon dont la date est formatée
  gender: string;
  role: string;
}
