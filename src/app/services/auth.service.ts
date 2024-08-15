import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';

  private token: string | null = null;

  constructor(private http: HttpClient) { }

  login(cpf: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/auth/login`, { cpf, password }).pipe(retry(1));
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }
  
  clearToken(): void {
    this.token = null;
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
