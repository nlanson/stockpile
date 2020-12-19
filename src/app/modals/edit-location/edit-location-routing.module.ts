import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditLocationPage } from './edit-location.page';

const routes: Routes = [
  {
    path: '',
    component: EditLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditLocationPageRoutingModule {}
