import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type MovementType = 'Deposit' | 'Withdrawal';

export interface CreateMovementDto {
  accountId: string;
  type: MovementType;
  value: number;
}

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private http = inject(HttpClient);
  private base = `${environment.api}/movimientos`;

  create(dto: CreateMovementDto) {
    return this.http.post(this.base, dto);
  }

  // opcional: listar últimos movimientos por cuenta (si tienes endpoint)
  listByAccount(accountId: string) {
    return this.http.get(`${this.base}?accountId=${accountId}`);
  }

  getReport(clientId: string, desde: string, hasta: string) {
  const params = new HttpParams()
    .set('ClientId', clientId)   // Model binding en .NET es case-insensitive
    .set('Desde', desde)
    .set('Hasta', hasta);
  return this.http.get<any[]>(`${this.base}/reporte`, { params });
}
}