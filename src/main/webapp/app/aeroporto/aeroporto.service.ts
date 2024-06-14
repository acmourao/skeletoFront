import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AeroportoDTO } from 'app/aeroporto/aeroporto.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class AeroportoService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/aeroportos';

  getAllAeroportoes() {
    return this.http.get<AeroportoDTO[]>(this.resourcePath);
  }

  getAeroporto(id: number) {
    return this.http.get<AeroportoDTO>(this.resourcePath + '/' + id);
  }

  createAeroporto(aeroportoDTO: AeroportoDTO) {
    return this.http.post<number>(this.resourcePath, aeroportoDTO);
  }

  updateAeroporto(id: number, aeroportoDTO: AeroportoDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, aeroportoDTO);
  }

  deleteAeroporto(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getLocalidadeValues() {
    return this.http.get<Record<string,string>>(this.resourcePath + '/localidadeValues')
        .pipe(map(transformRecordToMap));
  }

}
