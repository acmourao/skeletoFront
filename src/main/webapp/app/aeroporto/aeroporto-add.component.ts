import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { AeroportoService } from 'app/aeroporto/aeroporto.service';
import { AeroportoDTO } from 'app/aeroporto/aeroporto.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-aeroporto-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './aeroporto-add.component.html'
})
export class AeroportoAddComponent implements OnInit {

  aeroportoService = inject(AeroportoService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  localidadeValues?: Map<number,string>;

  addForm = new FormGroup({
    sigla: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    uf: new FormControl(null, [Validators.required, Validators.maxLength(2)]),
    cidade: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    aeroporto: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    localidade: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@aeroporto.create.success:Aeroporto was created successfully.`,
      AEROPORTO_SIGLA_UNIQUE: $localize`:@@Exists.aeroporto.sigla:This Sigla is already taken.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.aeroportoService.getLocalidadeValues()
        .subscribe({
          next: (data) => this.localidadeValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new AeroportoDTO(this.addForm.value);
    this.aeroportoService.createAeroporto(data)
        .subscribe({
          next: () => this.router.navigate(['/aeroportos'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
