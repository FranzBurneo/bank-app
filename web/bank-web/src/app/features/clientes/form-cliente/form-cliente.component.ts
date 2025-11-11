import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClientesService } from '../../../core/services/clientes.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Cliente {
  id?: string;
  name: string;
  gender: 'M' | 'F';
  phone?: string;
  age?: number;
  identification?: string;
  address?: string;
  clientCode?: string;
  password?: string;
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

  isEdit = false;
  saving = false;

  f = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    gender: <'M' | 'F'>('M'),
    age: [0, Validators.required],
    identification: [''],
    address: [''],
    phone: [''],
    clientCode: [''],
    password: ['']
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(pm => {
          const id = pm.get('id');
          this.isEdit = !!id;
          if (!id) return of(null);
          return this.svc.getById(id);
        })
      )
      .subscribe(cli => {
        if (!cli) {
          this.f.reset({
            id: '',
            name: '',
            gender: 'M',
            age: 0,
            identification: '',
            address: '',
            phone: '',
            clientCode: '',
            password: ''
          });
          return;
        }

        this.f.patchValue({
          id:       (cli as any).id ?? '',
          name:     (cli as any).name ?? '',
          gender:   (cli as any).gender ?? 'M',
          phone:    (cli as any).phone ?? '',
          age:      (cli as any).age ?? 0,
          identification: (cli as any).identification ?? '',
          address:  (cli as any).address ?? '',
          clientCode: (cli as any).clientCode ?? '',
          password: ''
        });
      });
  }

  genCode() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const pick = (n: number) =>
      Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    const code = `CL-${pick(8)}`;
    this.f.patchValue({ clientCode: code });
  }

  save(): void {
    if (this.f.invalid) { this.f.markAllAsTouched(); return; }
    this.saving = true;

    const payload = this.f.value as Cliente;

    const obs =
      this.isEdit && payload.id
        ? this.svc.update(payload.id, payload as any)
        : this.svc.create(payload as any);

    obs.subscribe({
      next: () => this.router.navigate(['/clientes']),
      error: () => this.saving = false
    });
  }
}