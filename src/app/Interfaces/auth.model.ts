import {Gender} from "./gender";

export interface SigninCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
  displayName: string;
    email: string;
  password: string;
}



export interface ClientSignup {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  yearsOfBirth: Date;
  gender: Gender;

}


export interface SellerSignup {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  yearsOfBirth: Date;
  gender: Gender;
  city: string;
  occupation: string;
}
