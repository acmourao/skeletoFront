import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { EstadoService } from 'app/estado/estado.service';
import { EstadoDTO } from 'app/estado/estado.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-estado-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './estado-add.component.html'
})
export class EstadoAddComponent {

  estadoService = inject(EstadoService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    uf: new FormControl(null, [Validators.required, Validators.maxLength(2)]),
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
      created: $localize`:@@estado.create.success:Estado was created successfully.`,
      ESTADO_UF_VALID: $localize`:@@Exists.estado.uf:This Uf is already taken.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new EstadoDTO(this.addForm.value);
    this.estadoService.createEstado(data)
        .subscribe({
          next: () => this.router.navigate(['/estados'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
