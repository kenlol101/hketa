import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtaComponent } from './eta/eta.component';

const routes: Routes = [
  { path: 'eta', component: EtaComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
