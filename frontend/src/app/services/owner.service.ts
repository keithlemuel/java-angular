import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OwnerView, OwnerPayload } from '../models/owner';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private apiUrl = 'http://localhost:8080/api/owners';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  getAllOwners(): Observable<OwnerView[]> {
    return this.http.get<OwnerView[]>(this.apiUrl, {
      headers: this.getHeaders(),
      params: new HttpParams().set('projection', 'ownerSummary')
    });
  }

  getOwnerById(id: number): Observable<OwnerView> {
    return this.http.get<OwnerView>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
      params: new HttpParams().set('projection', 'ownerSummary')
    });
  }

  getCurrentOwner(): Observable<OwnerView> {
    return this.http.get<OwnerView>(`${this.apiUrl}/current`, {
      headers: this.getHeaders(),
      params: new HttpParams().set('projection', 'ownerSummary')
    });
  }

  createOwner(owner: OwnerPayload): Observable<OwnerView> {
    return this.http.post<OwnerView>(this.apiUrl, owner, {
      headers: this.getHeaders()
    });
  }

  updateOwner(id: number, owner: OwnerPayload): Observable<OwnerView> {
    return this.http.put<OwnerView>(`${this.apiUrl}/${id}`, owner, {
      headers: this.getHeaders()
    });
  }

  deleteOwner(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
} 