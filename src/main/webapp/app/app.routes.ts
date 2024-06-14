import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EstadoListComponent } from './estado/estado-list.component';
import { EstadoAddComponent } from './estado/estado-add.component';
import { EstadoEditComponent } from './estado/estado-edit.component';
import { MunicipioListComponent } from './municipio/municipio-list.component';
import { MunicipioAddComponent } from './municipio/municipio-add.component';
import { MunicipioEditComponent } from './municipio/municipio-edit.component';
import { AeroportoListComponent } from './aeroporto/aeroporto-list.component';
import { AeroportoAddComponent } from './aeroporto/aeroporto-add.component';
import { AeroportoEditComponent } from './aeroporto/aeroporto-edit.component';
import { UsuarioListComponent } from './usuario/usuario-list.component';
import { UsuarioAddComponent } from './usuario/usuario-add.component';
import { UsuarioEditComponent } from './usuario/usuario-edit.component';
import { BancoListComponent } from './banco/banco-list.component';
import { BancoAddComponent } from './banco/banco-add.component';
import { BancoEditComponent } from './banco/banco-edit.component';
import { ErrorComponent } from './error/error.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: $localize`:@@home.index.headline:Welcome to your new app!`
  },
  {
    path: 'estados',
    component: EstadoListComponent,
    title: $localize`:@@estado.list.headline:Estados`
  },
  {
    path: 'estados/add',
    component: EstadoAddComponent,
    title: $localize`:@@estado.add.headline:Add Estado`
  },
  {
    path: 'estados/edit/:uf',
    component: EstadoEditComponent,
    title: $localize`:@@estado.edit.headline:Edit Estado`
  },
  {
    path: 'municipios',
    component: MunicipioListComponent,
    title: $localize`:@@municipio.list.headline:Municipios`
  },
  {
    path: 'municipios/add',
    component: MunicipioAddComponent,
    title: $localize`:@@municipio.add.headline:Add Municipio`
  },
  {
    path: 'municipios/edit/:id',
    component: MunicipioEditComponent,
    title: $localize`:@@municipio.edit.headline:Edit Municipio`
  },
  {
    path: 'aeroportos',
    component: AeroportoListComponent,
    title: $localize`:@@aeroporto.list.headline:Aeroportos`
  },
  {
    path: 'aeroportos/add',
    component: AeroportoAddComponent,
    title: $localize`:@@aeroporto.add.headline:Add Aeroporto`
  },
  {
    path: 'aeroportos/edit/:id',
    component: AeroportoEditComponent,
    title: $localize`:@@aeroporto.edit.headline:Edit Aeroporto`
  },
  {
    path: 'usuarios',
    component: UsuarioListComponent,
    title: $localize`:@@usuario.list.headline:Usuarios`
  },
  {
    path: 'usuarios/add',
    component: UsuarioAddComponent,
    title: $localize`:@@usuario.add.headline:Add Usuario`
  },
  {
    path: 'usuarios/edit/:id',
    component: UsuarioEditComponent,
    title: $localize`:@@usuario.edit.headline:Edit Usuario`
  },
  {
    path: 'bancos',
    component: BancoListComponent,
    title: $localize`:@@banco.list.headline:Bancos`
  },
  {
    path: 'bancos/add',
    component: BancoAddComponent,
    title: $localize`:@@banco.add.headline:Add Banco`
  },
  {
    path: 'bancos/edit/:id',
    component: BancoEditComponent,
    title: $localize`:@@banco.edit.headline:Edit Banco`
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: $localize`:@@error.headline:Error`
  },
  {
    path: '**',
    component: ErrorComponent,
    title: $localize`:@@notFound.headline:Page not found`
  }
];
