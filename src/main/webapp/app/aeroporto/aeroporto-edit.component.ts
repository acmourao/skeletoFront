import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AeroportoService } from 'app/aeroporto/aeroporto.service';
import { AeroportoDTO } from 'app/aeroporto/aeroporto.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-aeroporto-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './aeroporto-edit.component.html'
})
export class AeroportoEditComponent implements OnInit {

  aeroportoService = inject(AeroportoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  localidadeValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    sigla: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    uf: new FormControl(null, [Validators.required, Validators.maxLength(2)]),
    cidade: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    aeroporto: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    localidade: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@aeroporto.update.success:Aeroporto was updated successfully.`,
      AEROPORTO_SIGLA_UNIQUE: $localize`:@@Exists.aeroporto.sigla:This Sigla is already taken.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.aeroportoService.getLocalidadeValues()
        .subscribe({
          next: (data) => this.localidadeValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.aeroportoService.getAeroporto(this.currentId!)
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
    const data = new AeroportoDTO(this.editForm.value);
    this.aeroportoService.updateAeroporto(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/aeroportos'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
