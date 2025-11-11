import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MovimientosService } from '../../../core/services/movimientos.service';
import { CuentasService } from '../../../core/services/cuentas.service';

type UiType = 'Deposit' | 'Withdrawal';     // UI
type ApiType = 'Credito' | 'Debito';        // API

interface CuentaLite {
  id: string;
  number: string;
  currentBalance?: number;
}

@Component({
  selector: 'app-form-movimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-movimiento.component.html',
  styleUrls: ['./form-movimiento.component.css']
})
export class FormMovimientoComponent implements OnInit {
  f!: FormGroup;
  saving = false;
  submitted = false;

  cuentas: CuentaLite[] = [];

  // signals (estado reactivo de la UI)
  saldoActual = signal<number>(0);
  valueSig   = signal<number>(0);
  typeSig    = signal<UiType>('Deposit');

  // vistas derivadas (reaccionan a los signals)
  saldoPreview = computed(() => {
    const base = this.saldoActual();
    const v = this.valueSig();
    const t = this.typeSig();
    if (!v) return base;
    return t === 'Deposit' ? base + v : base - v;
  });

  delta    = computed(() => this.saldoPreview() - this.saldoActual());
  absDelta = computed(() => Math.abs(this.delta()));

  constructor(
    private fb: FormBuilder,
    private movimientosSvc: MovimientosService,
    private cuentasSvc: CuentasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.f = this.fb.group({
      accountId: ['', Validators.required],
      type: ['Deposit' as UiType, Validators.required],
      value: [0, [Validators.required, Validators.min(0.01)]],
    });

    // Sincroniza los controles del form con los signals
    this.valueSig.set(Number(this.f.get('value')!.value || 0));
    this.typeSig.set(this.f.get('type')!.value as UiType);

    this.f.get('value')!.valueChanges.subscribe(v =>
      this.valueSig.set(Number(v) || 0)
    );
    this.f.get('type')!.valueChanges.subscribe(t =>
      this.typeSig.set(t as UiType)
    );

    // Cuentas
    this.cuentasSvc.getAll().subscribe((list: any) => {
      this.cuentas = (list || []).map((x: any) => ({
        id: x.id,
        number: x.number,
        currentBalance: x.currentBalance
      }));
    });

    // Cuando cambia la cuenta, actualiza saldoActual
    this.f.get('accountId')!.valueChanges.subscribe(id => {
      const acc = this.cuentas.find(c => c.id === id);
      this.saldoActual.set(acc?.currentBalance ?? 0);
    });
  }

  private mapUiToApi(t: UiType): ApiType {
    return t === 'Deposit' ? 'Credito' : 'Debito';
  }

  save(): void {
    this.submitted = true;
    if (this.f.invalid) {
      this.f.markAllAsTouched();
      return;
    }

    this.saving = true;

    const payload = {
      accountId: this.f.value.accountId as string,
      type: this.mapUiToApi(this.f.value.type as UiType),
      value: Number(this.f.value.value)
    };

    this.movimientosSvc.create(payload).subscribe({
      next: () => this.router.navigate(['/movimientos'], { queryParams: { ok: 1 } }),
      error: (err) => {
        this.saving = false;
        alert(err?.error?.message ?? 'No se pudo registrar el movimiento.');
      }
    });
  }
}