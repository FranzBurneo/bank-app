import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink  } from '@angular/router';
import { CuentasService } from '../../../core/services/cuentas.service';
import { ClientesService } from '../../../core/services/clientes.service';

type AccountType = 'Ahorro' | 'Corriente';

@Component({
  selector: 'app-form-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-cuenta.component.html',
  styleUrls: ['./form-cuenta.component.css']
})
export class FormCuentaComponent implements OnInit {
  f!: FormGroup;
  saving = false;
  clientes: Array<{ id: string; name: string }> = [];
  isEdit = false;
  private idToEdit: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cuentasSvc: CuentasService,
    private clientesSvc: ClientesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.f = this.fb.group({
      number: ['', Validators.required],
      type: ['Ahorro' as AccountType, Validators.required],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      clientId: ['', Validators.required],
      state: [true]
    });

    this.idToEdit = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.idToEdit;

    if (this.isEdit && this.idToEdit) {
      this.cuentasSvc.getById(this.idToEdit).subscribe({
        next: (cuenta: any) => this.patchForm(cuenta),
        error: () => this.router.navigate(['/cuentas'])
      });
    }

    this.clientesSvc.getAll().subscribe({
      next: (list: any[]) => {
        this.clientes = list.map(x => ({ id: x.id, name: x.name }));
      }
    });
  }

  private patchForm(cuenta: any) {
    this.f.patchValue({
      number: cuenta.number,
      type: cuenta.type as AccountType,
      initialBalance: cuenta.initialBalance,
      clientId: cuenta.clientId,
      state: cuenta.isActive
    });
  }

  private mapTypeToApi(value: AccountType) {
    return value === 'Corriente' ? 1 : 0;
  }

  get fc() { return this.f.controls as any; }

  submitted = false;

  save(): void {
    if (this.f.invalid) {
      this.submitted = true;
      this.f.markAllAsTouched();
      return;
    }
    this.saving = true;

    const v = this.f.value;
    const payload: any = {
      id: this.idToEdit ?? undefined,
      number: v.number,
      type: v.type as AccountType,
      initialBalance: v.initialBalance,
      isActive: v.state,
      clientId: v.clientId
    };

    const req$ = this.isEdit && this.idToEdit
      ? this.cuentasSvc.update(this.idToEdit, payload)
      : this.cuentasSvc.create(payload);

    req$.subscribe({
      next: () => this.router.navigate(['/cuentas']),
      error: () => (this.saving = false)
    });
  }
}