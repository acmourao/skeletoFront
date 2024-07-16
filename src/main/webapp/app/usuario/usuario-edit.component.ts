import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { UsuarioService } from 'app/usuario/usuario.service';
import { UsuarioDTO } from 'app/usuario/usuario.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-usuario-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './usuario-edit.component.html'
})
export class UsuarioEditComponent implements OnInit {

  usuarioService = inject(UsuarioService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  bancoValues?: Map<number,string>;
  domicilioValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    nome: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    cpf: new FormControl(null, [Validators.required, Validators.maxLength(11)]),
    email: new FormControl(null, [Validators.required, Validators.maxLength(120)]),
    senha: new FormControl(null, [Validators.required, Validators.maxLength(60)]),
    active: new FormControl(false),
    telefone: new FormControl(null, [Validators.maxLength(20)]),
    nascimento: new FormControl(null),
    banco: new FormControl(null),
    domicilio: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@usuario.update.success:Usuario was updated successfully.`,
      USUARIO_EMAIL_UNIQUE: $localize`:@@Exists.usuario.email:This Email is already taken.`,
      USUARIO_BANCO_UNIQUE: $localize`:@@Exists.usuario.banco:This Banco is already referenced by another Usuario.`,
      USUARIO_DOMICILIO_UNIQUE: $localize`:@@Exists.usuario.domicilio:This Municipio is already referenced by another Usuario.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.usuarioService.getUsuario(this.currentId!)
        .subscribe({
          next: (data) => updateForm(this.editForm, data),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
      this.usuarioService.getBancoValues()
          .subscribe({
            next: (data) => this.bancoValues = data,
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
      this.usuarioService.getDomicilioValues()
          .subscribe({
            next: (data) => this.domicilioValues = data,
            error: (error) => this.errorHandler.handleServerError(error.error)
          });

  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new UsuarioDTO(this.editForm.value);
    this.usuarioService.updateUsuario(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/usuarios'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
