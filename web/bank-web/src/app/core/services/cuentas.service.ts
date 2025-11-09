import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CuentasService {
  private http = inject(HttpClient);
  private base = `${environment.api}/cuentas`; // con proxy => /api/cuentas

  getAll() {
    return this.http.get(this.base);
  }

  create(body: any) {
    return this.http.post(this.base, body);
  }

  delete(idOrNumber: string) {
    return this.http.delete(`${this.base}/${idOrNumber}`);
  }
}