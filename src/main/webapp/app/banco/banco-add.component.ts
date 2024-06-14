import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { BancoService } from 'app/banco/banco.service';
import { BancoDTO } from 'app/banco/banco.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-banco-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './banco-add.component.html'
})
export class BancoAddComponent {

  bancoService = inject(BancoService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    compe: new FormControl(null, [Validators.required, Validators.maxLength(3)]),
    cnpj: new FormControl(null, [Validators.required, Validators.maxLength(18)]),
    razaoSocial: new FormControl(null, [Validators.required, Validators.maxLength(127)]),
    nome: new FormControl(null, [Validators.maxLength(127)]),
    produtos: new FormControl(null, [Validators.maxLength(127)]),
    url: new FormControl(null, [Validators.maxLength(127)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@banco.create.success:Banco was created successfully.`,
      BANCO_COMPE_UNIQUE: $localize`:@@Exists.banco.compe:This Compe is already taken.`,
      BANCO_CNPJ_UNIQUE: $localize`:@@Exists.banco.cnpj:This Cnpj is already taken.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new BancoDTO(this.addForm.value);
    this.bancoService.createBanco(data)
        .subscribe({
          next: () => this.router.navigate(['/bancos'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
