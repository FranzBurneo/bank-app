import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MovimientosService, MovementType } from '../../../core/services/movimientos.service';
import { CuentasService } from '../../../core/services/cuentas.service';

interface CuentaLite {
  id: string;
  number: string;
  currentBalance?: number;
}

@Component({
  selector: 'app-form-movimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-movimiento.component.html',
  styleUrls: ['./form-movimiento.component.css']
})
export class FormMovimientoComponent implements OnInit {
  f!: FormGroup;
  saving = false;

  cuentas: CuentaLite[] = [];
  saldoActual = signal<number>(0);

  // Vista previa de saldo resultante
  saldoPreview = computed(() => {
    const val = Number(this.f?.get('value')?.value ?? 0);
    const type = this.f?.get('type')?.value as MovementType;
    const base = this.saldoActual();
    if (!val || !type) return base;
    return type === 'Deposit' ? base + val : base - val;
  });

  constructor(
    private fb: FormBuilder,
    private movimientosSvc: MovimientosService,
    private cuentasSvc: CuentasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.f = this.fb.group({
      accountId: ['', Validators.required],
      type: ['Deposit' as MovementType, Validators.required],
      value: [0, [Validators.required, Validators.min(0.01)]],
    });

    // carga mínima de cuentas
    this.cuentasSvc.getAll().subscribe((list: any) => {
      // ajusta si tu API devuelve otras propiedades
      this.cuentas = (list || []).map((x: any) => ({
        id: x.id,
        number: x.number,
        currentBalance: x.currentBalance
      }));
    });

    // cuando cambia cuenta, actualiza saldoActual (si no viene en getAll, haz otro GET detalle)
    this.f.get('accountId')!.valueChanges.subscribe(id => {
      const acc = this.cuentas.find(c => c.id === id);
      this.saldoActual.set(acc?.currentBalance ?? 0);
    });
  }

  save(): void {
    if (this.f.invalid) {
      this.f.markAllAsTouched();
      return;
    }

    // Validación adicional: retiros no deben dejar saldo negativo (si tu dominio lo exige)
    const type = this.f.value.type as MovementType;
    const value = Number(this.f.value.value);
    if (type === 'Withdrawal' && this.saldoActual() - value < 0) {
      alert('Saldo insuficiente para realizar el retiro.');
      return;
    }

    this.saving = true;
    this.movimientosSvc.create(this.f.value).subscribe({
      next: () => this.router.navigate(['/movimientos/nuevo'], { queryParams: { ok: 1 } }),
      error: (err) => {
        this.saving = false;
        const msg = err?.error?.message || 'No se pudo registrar el movimiento.';
        alert(msg);
      }
    });
  }
}