import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';

export interface Appointment {
  id?: number;
  pet: {
    id: number;
    name: string;
    species: string;
    breed: string;
    owner: {
      id: number;
      firstName: string;
      lastName: string;
    };
  };
  service: {
    id: number;
    name: string;
    duration: number;
    price: number;
  };
  dateTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/api/appointments';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getAppointmentsByPetId(petId: number): Observable<Appointment[]> {
    const params = new HttpParams()
      .set('projection', 'appointmentWithDetails');
    return this.http.get<Appointment[]>(`${this.apiUrl}/pet/${petId}`, { 
      headers: this.getHeaders(),
      params 
    });
  }

  getAppointmentsBetweenDates(start: string, end: string): Observable<Appointment[]> {
    const params = new HttpParams()
      .set('projection', 'appointmentWithDetails')
      .set('start', start)
      .set('end', end);
    return this.http.get<Appointment[]>(`${this.apiUrl}/between`, { 
      headers: this.getHeaders(),
      params 
    });
  }

  scheduleAppointment(appointment: Appointment): Observable<Appointment> {
    // Ensure time has leading zeros
    const dateTime = appointment.dateTime.replace(/T(\d):/, (_, hour) => `T${hour.padStart(2, '0')}:`);
    
    const payload = {
      pet: { id: appointment.pet.id },
      service: { id: appointment.service.id },
      dateTime: dateTime,
      status: 'SCHEDULED'
    };
    
    return this.http.post<Appointment>(this.apiUrl, payload, { headers: this.getHeaders() });
  }

  updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    const payload = {
      id: appointment.id,
      pet: { id: appointment.pet.id },
      service: { id: appointment.service.id },
      dateTime: appointment.dateTime,
      status: appointment.status
    };
    
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, payload, { headers: this.getHeaders() });
  }

  cancelAppointment(id: number): Observable<Appointment> {
    const payload = {
      id: id,
      status: 'CANCELLED'
    };
    return this.http.put<Appointment>(`${this.apiUrl}/${id}/cancel`, payload, { headers: this.getHeaders() });
  }
}