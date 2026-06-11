import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReservaService } from '../../services/reserva-service';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.css',
})
export class MisReservas implements OnInit {

  private reservaService = inject<ReservaService>(ReservaService);

  misReservas = signal<any[]>([]);

  ngOnInit() {
    this.cargarMisReservas();
  }

  cargarMisReservas() {
    this.reservaService.obtenerMisReservas().subscribe({
      next: (data) => {
        this.misReservas.set(data);
      },
      error: (err) => {
        console.error('Error al cargar las reservas del usuario:', err);
      },
    });
  }

  cancelarReserva(id: number) {
    if (confirm('¿Seguro que deseas cancelar esta reserva?')) {
      this.reservaService.eliminarReserva(id).subscribe({
        next: () => {
          this.misReservas.update((reservas) => reservas.filter((r) => r.id !== id));
          console.log('Reserva cancelada con éxito');
        },
        error: (err) => {
          console.error('Error al cancelar la reserva:', err);
          alert('No se pudo cancelar la reserva. Inténtalo de nuevo.');
        },
      });
    }
  }
}
