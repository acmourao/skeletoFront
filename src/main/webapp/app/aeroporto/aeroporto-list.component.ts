import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AeroportoService } from 'app/aeroporto/aeroporto.service';
import { AeroportoDTO } from 'app/aeroporto/aeroporto.model';


@Component({
  selector: 'app-aeroporto-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './aeroporto-list.component.html'})
export class AeroportoListComponent implements OnInit, OnDestroy {

  aeroportoService = inject(AeroportoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  aeroportoes?: AeroportoDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@aeroporto.delete.success:Aeroporto was removed successfully.`    };
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
    this.aeroportoService.getAllAeroportoes()
        .subscribe({
          next: (data) => this.aeroportoes = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.aeroportoService.deleteAeroporto(id)
          .subscribe({
            next: () => this.router.navigate(['/aeroportos'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
    }
  }

}
