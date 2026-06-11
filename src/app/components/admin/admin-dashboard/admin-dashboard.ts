import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private apiUrl = 'http://localhost:8080/api/reservas';

  reservas: any[] = [];
  stats: any = null;

  ngOnInit(): void {

    const usuarioString = localStorage.getItem('usuarioLogueado');
    const usuario = usuarioString ? JSON.parse(usuarioString) : null;

    if (!usuario || usuario.rol !== 'ADMIN') {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarDatos();
  }

  cargarDatos() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.reservas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando reservas', err)
    });

    this.http.get<any>(`${this.apiUrl}/dashboard/stats`).subscribe({
      next: (data) => {
        this.stats = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando estadísticas', err)
    });
  }

  marcarComoPagada(id: number) {

    this.http.patch(`${this.apiUrl}/${id}/estado`, { estado: 'PAGADA' })
      .subscribe({
        next: () => {
          alert('Reserva actualizada a PAGADA');
          this.cargarDatos();
        },
        error: (err) => {
          console.error('Error al actualizar estado', err);
          alert('No se pudo actualizar el estado de la reserva.');
        }
      });
  }

  cancelarReserva(id: number) {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.cargarDatos();
        },
        error: (err) => console.error('Error al eliminar/cancelar la reserva', err)
      });
    }
  }

  logout() {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
