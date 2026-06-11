import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  nuevoUsuario = {
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    rol: 'USER'
  };

  mensajeError: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    this.http
      .post('https://galapago-backend-terminado.onrender.com/api/auth/register', this.nuevoUsuario)
      .subscribe({
        next: (res) => {
          alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.mensajeError = err.error?.error || 'Error al conectar con el servidor';
        },
      });
  }
}
