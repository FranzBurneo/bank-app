import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientesService } from '../../../core/services/clientes.service';
import { Cliente } from '../form-cliente/form-cliente.component';

@Component({
  selector: 'app-list-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-clientes.component.html',
  styleUrls: ['./list-clientes.component.css']
})
export class ListClientesComponent implements OnInit {

  // 👉 propiedad usada por el template
  data: Cliente[] = [];

  private svc = inject(ClientesService);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.svc.getAll().subscribe(items => this.data = items);
  }

  remove(item: Cliente): void {
    if (!item.id) return;
    if (!confirm(`¿Eliminar a "${item.name}"?`)) return;

    this.svc.delete(item.id).subscribe({
      next: () => this.load()
    });
  }
}