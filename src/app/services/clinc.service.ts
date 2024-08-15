import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable, retry } from 'rxjs';
import { AuthService } from './auth.service';
import { ClincDTO } from '../dtos/clinc.dto';

@Injectable({
  providedIn: 'root',
})
export class ClincService {
 
  private apiUrl = `${environment.API_URL}/clinics`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAllClincs(): Observable<ClincDTO[]> {
    const headers = this.getAuthHeaders();
    
    return this.http.get<ClincDTO[]>(this.apiUrl, { headers }).pipe(retry(1));
  }

  createClinic(clinics: ClincDTO): Observable<any> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(this.apiUrl, clinics, { headers }).pipe(retry(1));
  }

  editClinc(clinicId: string, clinicData: ClincDTO): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/${clinicId}`, clinicData, { headers }).pipe(retry(1));
  }
  getClinicById(clinicId: string): Observable<ClincDTO> {
    return this.http.get<ClincDTO>(`${this.apiUrl}/${clinicId}`);
  }

  deleteClinc(clinicId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${clinicId}`, { headers }).pipe(retry(1));
  }
}
