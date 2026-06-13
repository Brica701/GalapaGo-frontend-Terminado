import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminServiciosService } from '../../../services/admin-servicios.service';
import { BusquedaService } from '../../../services/busqueda.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-servicios.html',
})
export class AdminServiciosComponent implements OnInit {
  private servicioService = inject(AdminServiciosService);
  private busquedaService = inject(BusquedaService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  servicios: any[] = [];
  editando = false;

  nuevoDetalleTexto: string = '';
  nuevaHabitacionTipo: string = '';
  nuevaHabitacionPrecio: number = 0;
  nuevaHabitacionCantidad: number = 1;

  tiposHabitacionDisponibles: string[] = ['SIMPLE', 'DOBLE', 'TRIPLE', 'SUITE', 'DELUXE'];

  servicioActual: any = this.getObjetoVacio();

  ngOnInit() {
    this.cargarServicios();
  }

  volverAlPanel() {
    this.router.navigate(['/admin/dashboard']);
  }

  private getObjetoVacio() {
    return {
      nombre: '',
      categoria: 'HOTEL',
      precioBase: 0,
      habitacionesDisponibles: 0,
      cupoDisponible: 0,
      descripcion: '',
      imagenUrl: '',
      ubicacion: '',
      destacado: false,
      capacidadMaxPersona: 1,
      detallesDinamicos: [],
      habitaciones: [],
      tieneWifi: false,
      tieneDesayuno: false,
      tieneTransporte: false,
      tieneEquipo: false,
    };
  }

  limpiarCamposPorCategoria() {
    if (this.servicioActual.categoria === 'EXCURSION') {
      this.servicioActual.habitaciones = [];
    }
  }

  agregarHabitacion() {
    if (!this.nuevaHabitacionTipo) return alert('Selecciona un tipo.');
    if (this.nuevaHabitacionPrecio <= 0) return alert('Precio inválido.');

    if (this.servicioActual.habitaciones.find((h: any) => h.tipo === this.nuevaHabitacionTipo)) {
      return alert('Este tipo ya fue añadido.');
    }

    this.servicioActual.habitaciones.push({
      tipo: this.nuevaHabitacionTipo,
      precioPorNoche: Number(this.nuevaHabitacionPrecio),
      cantidadTotal: Number(this.nuevaHabitacionCantidad),
    });

    this.nuevaHabitacionTipo = '';
    this.nuevaHabitacionPrecio = 0;
    this.nuevaHabitacionCantidad = 1;
  }

  eliminarHabitacion(index: number) {
    this.servicioActual.habitaciones.splice(index, 1);
  }

  agregarDetalle() {
    if (this.nuevoDetalleTexto.trim() !== '') {
      this.servicioActual.detallesDinamicos.push({ detalleTexto: this.nuevoDetalleTexto.trim() });
      this.nuevoDetalleTexto = '';
    }
  }

  eliminarDetalle(index: number) {
    this.servicioActual.detallesDinamicos.splice(index, 1);
  }

  cargarServicios() {
    this.servicioService.listarTodo().subscribe({
      next: (data: any) => {
        this.servicios = data.content || data || [];
        this.cdr.detectChanges();
      },
    });
  }

  prepararEdicion(s: any) {
    this.editando = true;
    this.servicioActual = {
      ...s,
      habitaciones: s.habitaciones ? [...s.habitaciones] : [],
      detallesDinamicos: s.detallesDinamicos ? [...s.detallesDinamicos] : [],
    };
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este servicio permanentemente?')) {
      this.servicioService.eliminar(id).subscribe({
        next: () => {
          this.cargarServicios();
          alert('Servicio eliminado');
        },
      });
    }
  }

  guardarServicio() {
    if (
      this.servicioActual.categoria === 'HOTEL' &&
      this.servicioActual.habitaciones.length === 0
    ) {
      return alert('⚠️ Error: Debes configurar al menos una habitación.');
    }

    const servicioAEnviar = {
      ...this.servicioActual,
      precioBase: Number(this.servicioActual.precioBase),
      habitaciones:
        this.servicioActual.categoria === 'HOTEL'
          ? this.servicioActual.habitaciones.map((h: any) => ({
              id: h.id || undefined,
              tipo: h.tipo,
              precioPorNoche: Number(h.precioPorNoche),
              cantidadTotal: Number(h.cantidadTotal),
            }))
          : [],
    };

    const operacion$ = this.editando
      ? this.servicioService.actualizar(this.servicioActual.id, servicioAEnviar)
      : this.servicioService.guardar(servicioAEnviar);

    operacion$.subscribe({
      next: () => {
        alert('Guardado correctamente');
        this.resetForm();
        this.cargarServicios();
      },
    });
  }

  resetForm() {
    this.editando = false;
    this.servicioActual = this.getObjetoVacio();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.servicioActual.imagenUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
