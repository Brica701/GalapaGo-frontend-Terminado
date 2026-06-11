import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminServiciosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/servicios';

  listarTodo(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  guardar(servicio: any): Observable<any> {
    return this.http.post(this.apiUrl, servicio);
  }

  actualizar(id: number, servicio: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, servicio);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
