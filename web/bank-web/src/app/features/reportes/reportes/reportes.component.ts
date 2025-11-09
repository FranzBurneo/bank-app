import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovimientosService } from '../../../core/services/movimientos.service';
import { ClientesService } from '../../../core/services/clientes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  f!: FormGroup;
  clientes: Array<{ id: string; name: string }> = [];
  rows: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private movSvc: MovimientosService,
    private cliSvc: ClientesService
  ) {}

  ngOnInit(): void {
    this.f = this.fb.group({
      clientId: ['', Validators.required],
      desde: ['', Validators.required],   // yyyy-MM-dd (input[type=date])
      hasta: ['', Validators.required],
    });

    this.cliSvc.getAll().subscribe((list: any[]) => {
      this.clientes = list.map(x => ({ id: x.id, name: x.name }));
    });
  }

  consultar(): void {
    if (this.f.invalid) { this.f.markAllAsTouched(); return; }

    // convertir a ISO con hora para incluir todo el día "hasta"
    const { clientId, desde, hasta } = this.f.value;
    const desdeIso = new Date(desde + 'T00:00:00').toISOString();
    const hastaIso = new Date(hasta + 'T23:59:59').toISOString();

    this.loading = true;
    this.movSvc.getReport(clientId, desdeIso, hastaIso).subscribe({
      next: (data) => { this.rows = data ?? []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  exportCsv(): void {
    if (!this.rows?.length) return;
    const headers = Object.keys(this.rows[0]);
    const csv = [
      headers.join(','),
      ...this.rows.map(r => headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'reporte_movimientos.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }
}