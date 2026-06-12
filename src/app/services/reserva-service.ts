import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  // "Caja" que mantiene la lista de reservas siempre actualizada
  private reservasSubject = new BehaviorSubject<any[]>(this.leerLocal());
  reservas$ = this.reservasSubject.asObservable();

  private leerLocal(): any[] {
    return JSON.parse(localStorage.getItem('mis_reservas') || '[]');
  }

  private guardarLocal(reservas: any[]): void {
    localStorage.setItem('mis_reservas', JSON.stringify(reservas));
    this.reservasSubject.next(reservas); // Esto hace que todos los componentes se refresquen
  }

  obtenerMisReservas(): Observable<any[]> {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    if (!usuarioGuardado) return of([]);

    const usuario = JSON.parse(usuarioGuardado);
    const todas = this.leerLocal();
    return of(todas.filter((r) => r.usuarioId === usuario.id));
  }

  eliminarReserva(id: number): Observable<any> {
    const nuevas = this.leerLocal().filter((r) => r.id !== id);
    this.guardarLocal(nuevas);
    return of({ success: true });
  }

  guardar(reserva: any): Observable<any> {
    const reservas = this.leerLocal();
    const nueva = { ...reserva, id: Date.now() };
    reservas.push(nueva);
    this.guardarLocal(reservas);
    return of(nueva);
  }

  confirmarReserva(id: number): Observable<any> {
    const reservas = this.leerLocal();
    const index = reservas.findIndex((r) => r.id === id);
    if (index !== -1) {
      reservas[index].confirmada = true;
      this.guardarLocal(reservas);
    }
    return of(reservas[index]);
  }
}
