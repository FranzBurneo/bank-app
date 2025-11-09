import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CuentasService } from '../../../core/services/cuentas.service';
import { ClientesService } from '../../../core/services/clientes.service';

type AccountType = 'Ahorros' | 'Corriente';

@Component({
  selector: 'app-form-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-cuenta.component.html',
  styleUrls: ['./form-cuenta.component.css']
})
export class FormCuentaComponent implements OnInit {
  f!: FormGroup;
  saving = false;
  clientes: Array<{ id: string; name: string }> = [];

  constructor(
    private fb: FormBuilder,
    private cuentasSvc: CuentasService,
    private clientesSvc: ClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.f = this.fb.group({
      number: ['', Validators.required],
      type: ['Ahorros' as AccountType, Validators.required],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      clientId: ['', Validators.required],
      state: [true]
    });

    // cargar clientes para el selector
    this.clientesSvc.getAll().subscribe({
      next: (list: any[]) => {
        // Ajusta los nombres si tu API devuelve otras propiedades
        this.clientes = list.map(x => ({ id: x.id, name: x.name }));
      }
    });
  }

  save(): void {
    if (this.f.invalid) {
      this.f.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.cuentasSvc.create(this.f.value).subscribe({
      next: () => this.router.navigate(['/cuentas']),
      error: () => (this.saving = false)
    });
  }
}