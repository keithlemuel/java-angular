import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewVaccination, Vaccination } from '../models/vaccination';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VaccinationService {
  private apiUrl = 'http://localhost:8080/api/vaccinations';

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

  getAllVaccinations(): Observable<Vaccination[]> {
    return this.http.get<Vaccination[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getVaccinationsByPetId(petId: number): Observable<Vaccination[]> {
    return this.http.get<Vaccination[]>(`${this.apiUrl}/pet/${petId}`, { headers: this.getHeaders() });
  }

  getDueVaccinations(date: string): Observable<Vaccination[]> {
    return this.http.get<Vaccination[]>(`${this.apiUrl}/due-before?date=${date}`, { headers: this.getHeaders() });
  }

  addVaccination(vaccination: NewVaccination): Observable<Vaccination> {
    return this.http.post<Vaccination>(this.apiUrl, vaccination, { headers: this.getHeaders() });
  }

  updateVaccination(id: number, vaccination: Vaccination): Observable<Vaccination> {
    return this.http.put<Vaccination>(`${this.apiUrl}/${id}`, vaccination, { headers: this.getHeaders() });
  }

  deleteVaccination(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
} 