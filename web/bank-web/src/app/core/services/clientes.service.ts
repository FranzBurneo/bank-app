import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClienteDto {
  id?: string;
  name: string;
  gender: 'M' | 'F';
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private http = inject(HttpClient);
  // Con proxy: /api → http://localhost:5178 (o el puerto de tu API)
  private readonly base = '/api/clientes';

  /** Listado */
  getAll(): Observable<ClienteDto[]> {
    return this.http.get<ClienteDto[]>(this.base);
  }

  /** Detalle */
  getById(id: string): Observable<ClienteDto> {
    return this.http.get<ClienteDto>(`${this.base}/${id}`);
  }

  /** Crear */
  create(body: ClienteDto): Observable<ClienteDto> {
    return this.http.post<ClienteDto>(this.base, body);
  }

  /** Actualizar */
  update(id: string, body: ClienteDto): Observable<ClienteDto> {
    return this.http.put<ClienteDto>(`${this.base}/${id}`, body);
  }

  /** Eliminar */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}