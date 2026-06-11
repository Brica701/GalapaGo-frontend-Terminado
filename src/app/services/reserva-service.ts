import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/reservas';

  obtenerMisReservas(): Observable<any[]> {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    if (!usuarioGuardado) {
      console.warn('No hay usuario logueado en el sistema.');
      return of([]);
    }
    const usuario = JSON.parse(usuarioGuardado);
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuario.id}`);
  }

  eliminarReserva(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  //Pagos
  guardar(reserva: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, reserva);
  }

  confirmarReserva(id: number): Observable<any> {

    return this.http.put(`${this.apiUrl}/${id}/confirmar`, {});
  }
}
