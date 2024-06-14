import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { EstadoService } from 'app/estado/estado.service';
import { EstadoDTO } from 'app/estado/estado.model';


@Component({
  selector: 'app-estado-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './estado-list.component.html'})
export class EstadoListComponent implements OnInit, OnDestroy {

  estadoService = inject(EstadoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  estadoes?: EstadoDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@estado.delete.success:Estado was removed successfully.`,
      'estado.municipio.uf.referenced': $localize`:@@estado.municipio.uf.referenced:This entity is still referenced by Municipio ${details?.id} via field Uf.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }
  
  loadData() {
    this.estadoService.getAllEstadoes()
        .subscribe({
          next: (data) => this.estadoes = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(uf: string) {
    if (confirm(this.getMessage('confirm'))) {
      this.estadoService.deleteEstado(uf)
          .subscribe({
            next: () => this.router.navigate(['/estados'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/estados'], {
                  state: {
                    msgError: this.getMessage(messageParts[0], { id: messageParts[1] })
                  }
                });
                return;
              }
              this.errorHandler.handleServerError(error.error)
            }
          });
    }
  }

}
