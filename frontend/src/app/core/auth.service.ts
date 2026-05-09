import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): boolean {
    // Implement your actual authentication logic here
    // For now, let's assume the user is always logged in
    return true;
  }

  login(): void {
    // Implement your login logic
    console.log('User logged in');
  }

  logout(): void {
    // Implement your logout logic
    console.log('User logged out');
  }
}
