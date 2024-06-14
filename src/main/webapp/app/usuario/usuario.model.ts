export class UsuarioDTO {

  constructor(data:Partial<UsuarioDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  nome?: string|null;
  cpf?: string|null;
  email?: string|null;
  senha?: string|null;
  active?: boolean|null;
  telefone?: string|null;
  nascimento?: string|null;
  banco?: number|null;
  domicilio?: number|null;

}
