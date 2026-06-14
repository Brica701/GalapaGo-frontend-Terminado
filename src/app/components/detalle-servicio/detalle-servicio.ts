import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BusquedaService } from '../../services/busqueda.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ComentarioService } from '../../services/comentario';
import { Comentario } from '../../models/comentario.model';
import { ReservaService } from '../../services/reserva-service';

@Component({
  selector: 'app-detalle-servicio',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './detalle-servicio.html',
  styleUrls: ['./detalle-servicio.css'],
})
export class DetalleServicioComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  busquedaService = inject(BusquedaService);
  private comentarioService = inject(ComentarioService);
  private reservaService = inject(ReservaService);

  servicio = signal<any>(null);
  pasoConfirmacion = signal(false);
  reservaConfirmada = signal(false);
  comentarios = signal<Comentario[]>([]);

  cantidadPersonas: number = 1;
  cantidadHabitaciones: number = 1;
  tipoHabitacionSeleccionada: string = '';
  textoComentario: string = '';
  puntuacion: number = 5;

  fechaInicio: string = '';
  fechaFin: string = '';

  protected readonly Math = Math;

  noches = this.busquedaService.noches;
  isLoggedIn = this.busquedaService.usuarioLogueado;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatosFrescos(id);
    this.cargarComentarios();
  }

  getFechaMinima(): string {
    const hoy = new Date();

    return hoy.toISOString().split('T')[0];
  }

  cargarDatosFrescos(id: number) {
    const timestamp = new Date().getTime();
    this.http
      .get(`https://galapago-backend-terminado.onrender.com/api/servicios/${id}?t=${timestamp}`)
      .subscribe({
        next: (data: any) => {
          this.servicio.set(data);
          this.busquedaService.actualizarServicioLocal(data);
        },
        error: () => this.router.navigate(['/']),
      });
  }

  confirmarReservaFinal() {
    const usuarioActual = this.busquedaService.datosUsuario();
    const servicioActual = this.servicio();
    if (!usuarioActual?.id) return;

    if (servicioActual.categoria === 'HOTEL' && this.fechaInicio >= this.fechaFin) {
      alert('La fecha de salida debe ser posterior a la de entrada.');
      return;
    }

    const totalPersonas =
      servicioActual.categoria === 'HOTEL'
        ? this.cantidadPersonas * this.cantidadHabitaciones
        : this.cantidadPersonas;

    const reservaData = {
      usuario: { id: usuarioActual.id },
      servicio: { id: servicioActual.id },
      habitacion:
        servicioActual.categoria === 'HOTEL' ? { id: this.getHabitacionActual()?.id } : null,
      fechaInicio: this.fechaInicio,
      fechaFin: servicioActual.categoria === 'HOTEL' ? this.fechaFin : this.fechaInicio,
      cantidadPersonas: totalPersonas,
      cantidadHabitaciones: servicioActual.categoria === 'HOTEL' ? this.cantidadHabitaciones : 0,
      tipoHabitacion: servicioActual.categoria === 'HOTEL' ? this.tipoHabitacionSeleccionada : null,
      estado: 'PENDIENTE',
    };

    this.reservaService.guardar(reservaData).subscribe({
      next: (reservaCreada: any) => {
        this.reservaConfirmada.set(true);
        this.router.navigate(['/pago', reservaCreada.id], {
          state: { precio: this.calcularPrecioDinamico() },
        });
      },
      error: (err) => alert(`❌ ${err.error?.message || 'Error al guardar reserva'}`),
    });
  }


  isAdmin(): boolean {
    return (
      this.busquedaService.datosUsuario()?.rol === 'ADMIN' ||
      this.busquedaService.datosUsuario()?.role === 'ADMIN'
    );
  }

  eliminarComentario(id: number) {
    if (confirm('¿Eliminar comentario?'))
      this.comentarioService.eliminar(id).subscribe(() => this.cargarComentarios());
  }

  cargarComentarios() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id)
      this.comentarioService
        .listarPorServicio(Number(id))
        .subscribe((d) => this.comentarios.set(d));
  }

  calcularPromedio(): number {
    const lista = this.comentarios();
    return lista.length === 0
      ? 0
      : Number((lista.reduce((a, b) => a + b.puntuacion, 0) / lista.length).toFixed(1));
  }

  enviarComentario() {
    const u = this.busquedaService.datosUsuario();
    if (!u?.id) return;
    this.comentarioService
      .publicar({
        usuario: { id: u.id },
        servicio: { id: this.servicio()?.id },
        puntuacion: this.puntuacion,
        texto: this.textoComentario,
      })
      .subscribe(() => {
        this.textoComentario = '';
        this.cargarComentarios();
      });
  }

  irAConfirmar() {
    if (this.isLoggedIn()) this.pasoConfirmacion.set(true);
    else this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

  obtenerPrecioMinimoHabitacion(): number {
    const s = this.servicio();
    if (!s) return 0;
    return s.categoria === 'HOTEL' && s.habitaciones?.length > 0
      ? Math.min(...s.habitaciones.map((h: any) => h.precioPorNoche))
      : s.precioBase;
  }

  getHabitacionActual(): any {
    const s = this.servicio();
    return s?.habitaciones?.find((h: any) => h.tipo === this.tipoHabitacionSeleccionada);
  }

  calcularNochesLocales(): number {
    if (!this.fechaInicio || !this.fechaFin) return 1;
    const d = (new Date(this.fechaFin).getTime() - new Date(this.fechaInicio).getTime()) / 86400000;
    return d > 0 ? d : 1;
  }

  calcularPrecioDinamico(): number {
    const s = this.servicio();
    if (!s) return 0;
    if (s.categoria === 'HOTEL') {
      const h = this.getHabitacionActual();
      return (
        (h ? h.precioPorNoche : this.obtenerPrecioMinimoHabitacion()) *
        this.cantidadHabitaciones *
        this.calcularNochesLocales()
      );
    }
    return s.precioBase * this.cantidadPersonas;
  }

  hayPlazasDisponibles(): boolean {
    const s = this.servicio();
    return s
      ? s.categoria === 'EXCURSION'
        ? s.cupoDisponible > 0
        : s.habitaciones?.some((h: any) => h.cantidadTotal > 0)
      : false;
  }
}
