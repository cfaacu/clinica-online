import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AdminUsuariosComponent } from './components/admin-usuarios/admin-usuarios.component';
import { MisTurnosEspecialistaComponent } from './components/mis-turnos-especialista/mis-turnos-especialista.component';
import { MisPacientesComponent } from './components/mis-pacientes/mis-pacientes.component';
import { SolicitarTurnoComponent } from './components/solicitar-turno/solicitar-turno.component';
import { MisTurnosTablaComponent } from './components/mis-turnos-tabla/mis-turnos-tabla.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { authGuard } from './guards/auth.guard';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminUsuariosComponent, canActivate: [authGuard] },
    { path: 'mis-turnos-especialista', component: MisTurnosEspecialistaComponent , canActivate: [authGuard]},
    { path: 'mis-pacientes', component: MisPacientesComponent , canActivate: [authGuard]},
    { path: 'solicitar-turno', component: SolicitarTurnoComponent, canActivate: [authGuard] },
    { path: 'mis-turnos-paciente', component: MisTurnosTablaComponent, canActivate: [authGuard] },
    { path: 'mi-perfil', component: MiPerfilComponent, canActivate: [authGuard] },
    { path: 'estadisticas', component: EstadisticasComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
