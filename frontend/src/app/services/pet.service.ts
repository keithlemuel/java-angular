import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private apiUrl = 'http://localhost:8080/api/pets';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getAllPets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getPetById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createPet(pet: any): Observable<any> {
    return this.http.post(this.apiUrl, pet, { headers: this.getHeaders() });
  }

  updatePet(id: number, pet: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, pet, { headers: this.getHeaders() });
  }

  deletePet(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}