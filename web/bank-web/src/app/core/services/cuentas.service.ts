import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CuentasService {
  private http = inject(HttpClient);
  private base = `${environment.api}/cuentas`;

  getAll() {
    return this.http.get(this.base);
  }

  getById(id: string) {
    return this.http.get(`${this.base}/${id}`);
  }

  create(body: any) {
    return this.http.post(this.base, body);
  }

  update(id: string, body: any) {
    return this.http.put(`${this.base}/${id}`, body);
  }

  delete(idOrNumber: string) {
    return this.http.delete(`${this.base}/${idOrNumber}`);
  }
}