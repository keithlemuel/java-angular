import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, { username, password })
      .pipe(tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }));
  }

  register(data: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/signup`, data, {
      responseType: 'text'
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isVet(): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.includes('ROLE_VET') ?? false;
  }

  getToken(): string | null {
    return this.currentUserSubject.value?.token ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
} 