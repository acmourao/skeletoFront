import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MunicipioService } from 'app/municipio/municipio.service';
import { MunicipioDTO } from 'app/municipio/municipio.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-municipio-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './municipio-edit.component.html'
})
export class MunicipioEditComponent implements OnInit {

  municipioService = inject(MunicipioService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  ufValues?: Record<string,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    municipio: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    uf: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@municipio.update.success:Municipio was updated successfully.`,
      MUNICIPIO_MUNICIPIO_UNIQUE: $localize`:@@Exists.municipio.municipio:This Municipio is already taken.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.municipioService.getUfValues()
        .subscribe({
          next: (data) => this.ufValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.municipioService.getMunicipio(this.currentId!)
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
    const data = new MunicipioDTO(this.editForm.value);
    this.municipioService.updateMunicipio(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/municipios'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
