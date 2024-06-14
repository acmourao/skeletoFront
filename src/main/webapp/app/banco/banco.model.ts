export class BancoDTO {

  constructor(data:Partial<BancoDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  compe?: string|null;
  cnpj?: string|null;
  razaoSocial?: string|null;
  nome?: string|null;
  produtos?: string|null;
  url?: string|null;

}
