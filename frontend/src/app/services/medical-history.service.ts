import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalHistory, NewMedicalHistory } from '../models/medical-history';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private apiUrl = 'http://localhost:8080/api/medical-histories';

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

  getAllMedicalHistories(): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getMedicalHistoryById(id: number): Observable<MedicalHistory> {
    return this.http.get<MedicalHistory>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getMedicalHistoriesByPetId(petId: number): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(`${this.apiUrl}/pet/${petId}`, { headers: this.getHeaders() });
  }

  addMedicalHistory(medicalHistory: NewMedicalHistory): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(this.apiUrl, medicalHistory, { headers: this.getHeaders() });
  }

  updateMedicalHistory(id: number, medicalHistory: MedicalHistory): Observable<MedicalHistory> {
    return this.http.put<MedicalHistory>(`${this.apiUrl}/${id}`, medicalHistory, { headers: this.getHeaders() });
  }

  deleteMedicalHistory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
} 