import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { EstadoService } from 'app/estado/estado.service';
import { EstadoDTO } from 'app/estado/estado.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-estado-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './estado-edit.component.html'
})
export class EstadoEditComponent implements OnInit {

  estadoService = inject(EstadoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentUf?: string;

  editForm = new FormGroup({
    uf: new FormControl({ value: null, disabled: true }),
    name: new FormControl(null, [Validators.required, Validators.maxLength(127)]),
    gentilic: new FormControl(null, [Validators.maxLength(127)]),
    gentilicAlternative: new FormControl(null, [Validators.maxLength(127)]),
    macroregion: new FormControl(null, [Validators.maxLength(127)]),
    website: new FormControl(null, [Validators.maxLength(127)]),
    timezone: new FormControl(null, [Validators.maxLength(127)]),
    flagImage: new FormControl(null, [Validators.maxLength(127)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@estado.update.success:Estado was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentUf = this.route.snapshot.params['uf'];
    this.estadoService.getEstado(this.currentUf!)
        .subscribe({
          next: (data) => updateForm(this.editForm, data),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new EstadoDTO(this.editForm.value);
    this.estadoService.updateEstado(this.currentUf!, data)
        .subscribe({
          next: () => this.router.navigate(['/estados'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
