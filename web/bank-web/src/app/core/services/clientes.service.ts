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
  // Con proxy: /api → http://localhost:5178
  private readonly base = '/api/clientes';

  getAll(): Observable<ClienteDto[]> {
    return this.http.get<ClienteDto[]>(this.base);
  }

  getById(id: string): Observable<ClienteDto> {
    return this.http.get<ClienteDto>(`${this.base}/${id}`);
  }

  create(body: ClienteDto): Observable<ClienteDto> {
    return this.http.post<ClienteDto>(this.base, body);
  }

  update(id: string, body: ClienteDto): Observable<ClienteDto> {
    return this.http.put<ClienteDto>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}