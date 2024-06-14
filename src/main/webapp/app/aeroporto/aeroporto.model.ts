export class AeroportoDTO {

  constructor(data:Partial<AeroportoDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  sigla?: string|null;
  uf?: string|null;
  cidade?: string|null;
  aeroporto?: string|null;
  localidade?: number|null;

}
