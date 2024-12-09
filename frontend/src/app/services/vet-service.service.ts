import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VetService } from '../models/vet-service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VetServiceService {
  private apiUrl = 'http://localhost:8080/api/services';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllServices(): Observable<VetService[]> {
    return this.http.get<VetService[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getServiceById(id: number): Observable<VetService> {
    return this.http.get<VetService>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createService(service: VetService): Observable<VetService> {
    return this.http.post<VetService>(this.apiUrl, service, { headers: this.getHeaders() });
  }

  updateService(id: number, service: VetService): Observable<VetService> {
    return this.http.put<VetService>(`${this.apiUrl}/${id}`, service, { headers: this.getHeaders() });
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
} 