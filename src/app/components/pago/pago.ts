import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../services/reserva-service';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago.html',
  styleUrls: ['./pago.css'],
})
export class PagoComponent implements OnInit {
  procesando: boolean = false;
  reservaId: number = 0;
  precioTotal: number = 0;

  private reservaService = inject(ReservaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.reservaId = idParam ? Number(idParam) : 0;
    this.precioTotal = history.state.precio || 0;
  }

  confirmarPago(): void {
    if (this.reservaId === 0) return;

    this.procesando = true;

    setTimeout(() => {
      this.reservaService.confirmarReserva(this.reservaId).subscribe({
        next: () => {
          this.procesando = false;
          this.router.navigate(['/mis-reservas']);
        },
        error: (err: any) => {
          console.error('Error al confirmar reserva:', err);
          this.procesando = false;
          alert('Error al procesar el pago.');
        },
      });
    }, 2000);
  }
}
