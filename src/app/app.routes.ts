import { Routes } from '@angular/router';
import { ListaServiciosComponent } from './components/lista-servicios/lista-servicios';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { DetalleServicioComponent } from './components/detalle-servicio/detalle-servicio';
import { PagoComponent } from './components/pago/pago';
import { MisReservas } from './components/mis-reservas/mis-reservas';

import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard';
import { AdminServiciosComponent } from './components/admin/admin-servicios/admin-servicios';

export const routes: Routes = [
  { path: '', component: ListaServiciosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'servicio/:id', component: DetalleServicioComponent },

  { path: 'pago/:id', component: PagoComponent },

  { path: 'mis-reservas', component: MisReservas },

  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/servicios', component: AdminServiciosComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
