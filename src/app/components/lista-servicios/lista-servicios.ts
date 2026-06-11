import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusquedaService } from '../../services/busqueda.service';
import { AdminServiciosService } from '../../services/admin-servicios.service';
import { ComentarioService } from '../../services/comentario';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-servicios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-servicios.html',
  styleUrls: ['./lista-servicios.css'],
})
export class ListaServiciosComponent implements OnInit {

  busquedaService = inject(BusquedaService);
  private adminService = inject(AdminServiciosService);
  private comentarioService = inject(ComentarioService);


  servicios = this.busquedaService.servicios;

  get filtroActual() {
    return this.busquedaService.filtroActual;
  }

  ngOnInit() {

    if (this.servicios().length === 0) {
      this.cargarServiciosDesdeBD();
    } else {
      this.cargarPuntuaciones();
    }
  }

  calcularPrecioMostrado(s: any): number {
    if (s.categoria === 'HOTEL' && s.habitaciones?.length > 0) {
      const precios = s.habitaciones.map((h: any) => h.precioPorNoche);
      return Math.min(...precios);
    }
    return s.precioBase ?? 0;
  }

  cargarServiciosDesdeBD() {
    this.adminService.listarTodo().subscribe({
      next: (data: any[]) => {
        this.busquedaService.servicios.set(data);
        this.cargarPuntuaciones();
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.busquedaService.cargando.set(false);
      },
    });
  }

  cargarPuntuaciones() {
    this.servicios().forEach((servicio: any) => {
      this.comentarioService.listarPorServicio(servicio.id).subscribe((comentarios: any[]) => {
        servicio.puntuacionPromedio =
          comentarios?.length > 0
            ? Number(
                (
                  comentarios.reduce((acc, curr) => acc + curr.puntuacion, 0) / comentarios.length
                ).toFixed(1),
              )
            : 0;

        this.busquedaService.servicios.update((lista) => [...lista]);
      });
    });
  }

  cambiarFiltro(nuevoFiltro: string) {
    this.busquedaService.filtroActual.set(nuevoFiltro);
  }

  serviciosFiltrados = computed(() => {
    const listaOriginal = this.servicios();
    const texto = (this.busquedaService.textoBusqueda() ?? '').toLowerCase().trim();
    const filtro = (this.busquedaService.filtroActual() ?? 'DESTACADOS').toUpperCase().trim();

    let lista = [...listaOriginal];

    if (filtro === 'DESTACADOS') {
      lista = lista.filter((s) => s?.destacado === true);
    } else {
      lista = lista.filter((s) => (s?.categoria ?? '').toUpperCase() === filtro);
    }

    if (texto) {
      lista = lista.filter(
        (s) =>
          (s?.nombre ?? '').toLowerCase().includes(texto) ||
          (s?.ubicacion ?? '').toLowerCase().includes(texto),
      );
    }

    return lista;
  });
}
