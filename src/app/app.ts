import { Component, signal, inject, AfterViewInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BusquedaService } from './services/busqueda.service';
import { FooterComponent } from './components/footer/footer';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit {
  router = inject(Router);
  public busquedaService = inject(BusquedaService);

  adultos = signal(2);
  habitaciones = signal(1);
  mostrarPersonas = signal(false);


  usuario: any = null;

  constructor() {
    this.verificarSesion();
  }

  verificarSesion() {
    const data = localStorage.getItem('usuarioLogueado');
    if (data) {
      this.usuario = JSON.parse(data);
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    this.usuario = null;
    window.location.href = '/';
  }

  ngAfterViewInit() {
    flatpickr('#calendario-booking', {
      mode: 'range',
      minDate: 'today',
      locale: Spanish,
      dateFormat: 'd M',

      defaultDate: this.busquedaService.fechaInicio() && this.busquedaService.fechaFin()
        ? [this.busquedaService.fechaInicio()!, this.busquedaService.fechaFin()!]
        : [],
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          const inicio = selectedDates[0];
          const fin = selectedDates[1];


          this.busquedaService.fechaInicio.set(inicio);
          this.busquedaService.fechaFin.set(fin);


          const diff = fin.getTime() - inicio.getTime();
          const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));


          const nochesCalculadas = dias > 0 ? dias : 1;
          this.busquedaService.noches.set(nochesCalculadas);

          console.log('Fechas actualizadas:', inicio, fin, 'Noches:', nochesCalculadas);
        }
      }
    });
  }


  togglePersonas() {
    this.mostrarPersonas.update(v => !v);
  }


  actualizarContador(tipo: 'adultos' | 'habitaciones', cantidad: number) {
    if (tipo === 'adultos') {
      const nuevo = this.adultos() + cantidad;
      if (nuevo >= 1) this.adultos.set(nuevo);
    } else {
      const nuevo = this.habitaciones() + cantidad;
      if (nuevo >= 1) this.habitaciones.set(nuevo);
    }
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.busquedaService.textoBusqueda.set(input.value);
  }
}
