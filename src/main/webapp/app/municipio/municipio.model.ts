export class MunicipioDTO {

  constructor(data:Partial<MunicipioDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  municipio?: string|null;
  uf?: string|null;

}
