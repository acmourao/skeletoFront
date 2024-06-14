import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { EstadoDTO } from 'app/estado/estado.model';


@Injectable({
  providedIn: 'root',
})
export class EstadoService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/estados';

  getAllEstadoes() {
    return this.http.get<EstadoDTO[]>(this.resourcePath);
  }

  getEstado(uf: string) {
    return this.http.get<EstadoDTO>(this.resourcePath + '/' + uf);
  }

  createEstado(estadoDTO: EstadoDTO) {
    return this.http.post<string>(this.resourcePath, estadoDTO);
  }

  updateEstado(uf: string, estadoDTO: EstadoDTO) {
    return this.http.put<string>(this.resourcePath + '/' + uf, estadoDTO);
  }

  deleteEstado(uf: string) {
    return this.http.delete(this.resourcePath + '/' + uf);
  }

}
