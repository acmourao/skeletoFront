import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { BancoService } from 'app/banco/banco.service';
import { BancoDTO } from 'app/banco/banco.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-banco-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './banco-edit.component.html'
})
export class BancoEditComponent implements OnInit {

  bancoService = inject(BancoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    compe: new FormControl(null, [Validators.required, Validators.maxLength(3)]),
    cnpj: new FormControl(null, [Validators.required, Validators.maxLength(18)]),
    razaoSocial: new FormControl(null, [Validators.required, Validators.maxLength(127)]),
    nome: new FormControl(null, [Validators.maxLength(127)]),
    produtos: new FormControl(null, [Validators.maxLength(127)]),
    url: new FormControl(null, [Validators.maxLength(127)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@banco.update.success:Banco was updated successfully.`,
      BANCO_COMPE_UNIQUE: $localize`:@@Exists.banco.compe:This Compe is already taken.`,
      BANCO_CNPJ_UNIQUE: $localize`:@@Exists.banco.cnpj:This Cnpj is already taken.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.bancoService.getBanco(this.currentId!)
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
    const data = new BancoDTO(this.editForm.value);
    this.bancoService.updateBanco(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/bancos'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
