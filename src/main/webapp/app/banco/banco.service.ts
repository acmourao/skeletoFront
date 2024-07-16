import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BancoDTO } from 'app/banco/banco.model';


@Injectable({
  providedIn: 'root',
})
export class BancoService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + 'bancos';

  getAllBancoes() {
    return this.http.get<BancoDTO[]>(this.resourcePath);
  }

  getBanco(id: number) {
    return this.http.get<BancoDTO>(this.resourcePath + '/' + id);
  }

  createBanco(bancoDTO: BancoDTO) {
    return this.http.post<number>(this.resourcePath, bancoDTO);
  }

  updateBanco(id: number, bancoDTO: BancoDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, bancoDTO);
  }

  deleteBanco(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
