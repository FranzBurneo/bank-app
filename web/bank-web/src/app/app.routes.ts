import { Routes } from '@angular/router';
import { ListClientesComponent } from './features/clientes/list-clientes/list-clientes.component';
import { FormClienteComponent } from './features/clientes/form-cliente/form-cliente.component';
import { ListCuentasComponent } from './features/cuentas/list-cuentas/list-cuentas.component';
import { FormMovimientoComponent } from './features/movimientos/form-movimiento/form-movimiento.component';
import { ReportesComponent } from './features/reportes/reportes/reportes.component';
import { FormCuentaComponent } from './features/cuentas/form-cuenta/form-cuenta.component';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },

  { path: 'clientes', component: ListClientesComponent },
  { path: 'clientes/nuevo', component: FormClienteComponent },

  // Cuentas
  { path: 'cuentas', component: ListCuentasComponent },
  { path: 'cuentas/nueva', component: FormCuentaComponent },

  { path: 'movimientos/nuevo', component: FormMovimientoComponent },

  { path: 'reportes', component: ReportesComponent },

  { path: '**', redirectTo: 'clientes' }
];