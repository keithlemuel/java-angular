import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pets',
    loadComponent: () => import('./features/pets/pets.component')
      .then(m => m.PetsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'appointments',
    loadComponent: () => import('./features/appointments/appointments.component')
      .then(m => m.AppointmentsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/services.component')
      .then(m => m.ServicesComponent),
    canActivate: [AuthGuard],
    data: { role: 'ROLE_VET' }
  },
  {
    path: 'vaccinations',
    loadComponent: () => import('./features/vaccinations/vaccinations.component')
      .then(m => m.VaccinationsComponent),
    canActivate: [AuthGuard],
    data: { role: 'ROLE_VET' }
  },
  {
    path: 'owners',
    loadComponent: () => import('./features/owners/owners.component')
      .then(m => m.OwnersComponent),
    canActivate: [AuthGuard],
    data: { role: 'ROLE_VET' }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 