import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio.model';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  private apiUrl = 'https://galapago-backend-terminado.onrender.com/api/servicios';

  constructor(private http: HttpClient) {}

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }
}
