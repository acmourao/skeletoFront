import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MunicipioDTO } from 'app/municipio/municipio.model';


@Injectable({
  providedIn: 'root',
})
export class MunicipioService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + 'municipios';

  getAllMunicipios() {
    return this.http.get<MunicipioDTO[]>(this.resourcePath);
  }

  getMunicipio(id: number) {
    return this.http.get<MunicipioDTO>(this.resourcePath + '/' + id);
  }

  createMunicipio(municipioDTO: MunicipioDTO) {
    return this.http.post<number>(this.resourcePath, municipioDTO);
  }

  updateMunicipio(id: number, municipioDTO: MunicipioDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, municipioDTO);
  }

  deleteMunicipio(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getUfValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/ufValues');
  }

}
