export class EstadoDTO {

  constructor(data:Partial<EstadoDTO>) {
    Object.assign(this, data);
  }

  uf?: string|null;
  name?: string|null;
  gentilic?: string|null;
  gentilicAlternative?: string|null;
  macroregion?: string|null;
  website?: string|null;
  timezone?: string|null;
  flagImage?: string|null;

}
