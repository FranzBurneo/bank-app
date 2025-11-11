import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CuentasService } from '../../../core/services/cuentas.service';
import { finalize } from 'rxjs/operators';

export interface Cuenta {
  id?: string;
  number: string;
  type: 'Ahorro' | 'Corriente' | string;
  initialBalance: number;
  state: boolean;
  clientName?: string;
}

@Component({
  selector: 'app-list-cuentas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-cuentas.component.html',
  styleUrls: ['./list-cuentas.component.css']
})
export class ListCuentasComponent implements OnInit {
  private svc = inject(CuentasService);

  items: Cuenta[] = [];
  loading = false;
  errorMsg = '';
  

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    this.svc.getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => (this.items = data as Cuenta[]),
        error: (err) => {
          console.error(err);
          this.errorMsg = 'No se pudieron cargar las cuentas.';
        }
      });
  }

  remove(row: Cuenta): void {
    const key = row.id ?? row.number;
    if (!key) return;

    if (!confirm(`¿Eliminar la cuenta ${row.number}?`)) return;

    this.loading = true;
    this.svc.delete(key)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => this.load(),
        error: (err) => {
          console.error(err);
          alert('No se pudo eliminar la cuenta. Intente nuevamente.');
        }
      });
  }

  trackByKey = (_: number, it: Cuenta) => it.id ?? it.number;
}