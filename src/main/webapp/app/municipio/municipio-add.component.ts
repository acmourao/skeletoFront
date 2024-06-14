import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MunicipioService } from 'app/municipio/municipio.service';
import { MunicipioDTO } from 'app/municipio/municipio.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-municipio-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './municipio-add.component.html'
})
export class MunicipioAddComponent implements OnInit {

  municipioService = inject(MunicipioService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  ufValues?: Record<string,string>;

  addForm = new FormGroup({
    municipio: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    uf: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@municipio.create.success:Municipio was created successfully.`,
      MUNICIPIO_MUNICIPIO_UNIQUE: $localize`:@@Exists.municipio.municipio:This Municipio is already taken.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.municipioService.getUfValues()
        .subscribe({
          next: (data) => this.ufValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new MunicipioDTO(this.addForm.value);
    this.municipioService.createMunicipio(data)
        .subscribe({
          next: () => this.router.navigate(['/municipios'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
