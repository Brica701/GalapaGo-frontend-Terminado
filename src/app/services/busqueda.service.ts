import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BusquedaService {
  private http = inject(HttpClient);
  private apiUrl = 'https://galapago-backend-terminado.onrender.com/api/servicios';

  cargando = signal<boolean>(true);

  textoBusqueda = signal('');
  fechaInicio = signal<any>(null);
  fechaFin = signal<any>(null);
  noches = signal<number>(1);
  personasSeleccionadas = signal<number>(1);
  habitacionesSeleccionadas = signal<number>(1);
  filtroActual = signal('DESTACADOS');

  servicios = signal<any[]>([]);

  usuarioLogueado = signal<boolean>(localStorage.getItem('usuarioLogueado') !== null);
  datosUsuario = signal<any | null>(JSON.parse(localStorage.getItem('usuarioLogueado') || 'null'));

  constructor() {
    this.cargarServiciosIniciales();
    this.actualizarEstadoSesion();
  }

  cargarServiciosIniciales() {
    this.cargando.set(true);
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.servicios.set(data || []);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al sincronizar servicios', err);
        this.cargando.set(false);
      },
    });
  }

  liberarCupos(reserva: any) {
    const servicio = this.servicios().find((s) => s.id === reserva.servicio.id);

    if (servicio) {
      const actualizado = { ...servicio };

      if (actualizado.categoria === 'EXCURSION') {
        actualizado.cupoDisponible += reserva.cantidadPersonas;
      } else if (actualizado.categoria === 'HOTEL') {
        const hab = actualizado.habitaciones.find((h: any) => h.id === reserva.habitacion?.id);
        if (hab) hab.cantidadTotal += reserva.cantidadHabitaciones;
      }

      this.actualizarServicioLocal(actualizado);
    }
  }

  actualizarEstadoSesion() {
    const data = localStorage.getItem('usuarioLogueado');
    if (data) {
      this.usuarioLogueado.set(true);
      this.datosUsuario.set(JSON.parse(data));
    } else {
      this.usuarioLogueado.set(false);
      this.datosUsuario.set(null);
    }
  }

  login(usuario: any) {
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
    this.actualizarEstadoSesion();
  }

  logout() {
    localStorage.removeItem('usuarioLogueado');
    this.actualizarEstadoSesion();
  }

  agregarServicioLocal(nuevo: any) {
    this.servicios.update((actual) => [...actual, nuevo]);
  }

  eliminarServicioLocal(id: number) {
    this.servicios.update((actual) => actual.filter((s: any) => s.id !== id));
  }

  actualizarServicioLocal(editado: any) {
    this.servicios.update((actual) => actual.map((s: any) => (s.id === editado.id ? editado : s)));
  }
}
