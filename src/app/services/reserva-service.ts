import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private http = inject(HttpClient);
  private apiUrl = 'https://galapago-backend-terminado.onrender.com/api/reservas';


  obtenerMisReservas(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  guardar(reserva: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reserva);
  }

  eliminarReserva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  confirmarReserva(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/confirmar`, {});
  }
}
