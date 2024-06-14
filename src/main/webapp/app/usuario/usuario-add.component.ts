import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { UsuarioService } from 'app/usuario/usuario.service';
import { UsuarioDTO } from 'app/usuario/usuario.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-usuario-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './usuario-add.component.html'
})
export class UsuarioAddComponent implements OnInit {

  usuarioService = inject(UsuarioService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  bancoValues?: Map<number,string>;
  domicilioValues?: Map<number,string>;

  addForm = new FormGroup({
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
      created: $localize`:@@usuario.create.success:Usuario was created successfully.`,
      USUARIO_EMAIL_UNIQUE: $localize`:@@Exists.usuario.email:This Email is already taken.`,
      USUARIO_BANCO_UNIQUE: $localize`:@@Exists.usuario.banco:This Banco is already referenced by another Usuario.`,
      USUARIO_DOMICILIO_UNIQUE: $localize`:@@Exists.usuario.domicilio:This Municipio is already referenced by another Usuario.`
    };
    return messages[key];
  }

  ngOnInit() {
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
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new UsuarioDTO(this.addForm.value);
    this.usuarioService.createUsuario(data)
        .subscribe({
          next: () => this.router.navigate(['/usuarios'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
