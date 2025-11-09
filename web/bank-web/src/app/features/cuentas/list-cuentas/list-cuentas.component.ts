import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CuentasService } from '../../../core/services/cuentas.service';

export interface Cuenta {
  id?: string;                 // GUID si tu API lo expone
  number: string;              // número de cuenta
  type: 'Ahorros' | 'Corriente' | string;
  initialBalance: number;
  state: boolean;
  clientName?: string;         // si tu API lo devuelve
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

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: (data: any) => {
        this.items = data as Cuenta[];
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  remove(row: Cuenta): void {
    // Ajusta el identificador según tu API (id | number)
    const key = row.id ?? row.number;
    if (!key) return;

    if (!confirm(`¿Eliminar cuenta ${row.number}?`)) return;
    this.svc.delete(key as string).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar la cuenta')
    });
  }

  trackByKey = (_: number, it: Cuenta) => it.id ?? it.number;
}