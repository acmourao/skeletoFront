import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MunicipioService } from 'app/municipio/municipio.service';
import { MunicipioDTO } from 'app/municipio/municipio.model';


@Component({
  selector: 'app-municipio-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './municipio-list.component.html'})
export class MunicipioListComponent implements OnInit, OnDestroy {

  municipioService = inject(MunicipioService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  municipios?: MunicipioDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@municipio.delete.success:Municipio was removed successfully.`,
      'municipio.aeroporto.localidade.referenced': $localize`:@@municipio.aeroporto.localidade.referenced:This entity is still referenced by Aeroporto ${details?.id} via field Localidade.`,
      'municipio.usuario.domicilio.referenced': $localize`:@@municipio.usuario.domicilio.referenced:This entity is still referenced by Usuario ${details?.id} via field Domicilio.`
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
    this.municipioService.getAllMunicipios()
        .subscribe({
          next: (data) => this.municipios = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.municipioService.deleteMunicipio(id)
          .subscribe({
            next: () => this.router.navigate(['/municipios'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/municipios'], {
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
