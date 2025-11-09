import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClientesService } from '../../../core/services/clientes.service';

export interface Cliente {
  id?: string;
  name: string;
  gender: 'M' | 'F';
  phone?: string;
}

@Component({
  selector: 'app-form-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.css']
})
export class FormClienteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(ClientesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // 👉 propiedades usadas por el template
  isEdit = false;
  saving = false;

  f = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    gender: <'M' | 'F'>('M'),
    phone: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    if (this.isEdit && id) {
      this.svc.getById(id).subscribe(cli => {
        if (cli) this.f.patchValue(cli as any);
      });
    }
  }

  save(): void {
    if (this.f.invalid) { this.f.markAllAsTouched(); return; }
    this.saving = true;

    const payload = this.f.value as Cliente;

    const obs = this.isEdit && payload.id
      ? this.svc.update(payload.id, payload)
      : this.svc.create(payload);

    obs.subscribe({
      next: () => this.router.navigate(['/clientes']),
      error: () => this.saving = false
    });
  }
}