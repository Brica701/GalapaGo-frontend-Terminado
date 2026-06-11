import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router'; // 👈 Añadido ActivatedRoute
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  email: string = '';
  password: string = '';
  errorMsg: string = '';
  returnUrl: string = '/';

  ngOnInit() {

    const urlCapurada = this.route.snapshot.queryParamMap.get('returnUrl');
    if (urlCapurada) {
      this.returnUrl = urlCapurada;
    }
  }

  acceder() {
    const credenciales = { email: this.email, password: this.password };

    this.http.post('http://localhost:8080/api/auth/login', credenciales).subscribe({
      next: (usuarioDB: any) => {
        console.log('Login exitoso:', usuarioDB);

        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioDB));

        if (usuarioDB.rol === 'ADMIN') {
          window.location.href = '/admin/dashboard';
        } else {
          this.router.navigateByUrl(this.returnUrl).then(() => {

            window.location.reload();
          });
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.errorMsg = err.error?.error || 'Correo o contraseña incorrectos';
      },
    });
  }
}
