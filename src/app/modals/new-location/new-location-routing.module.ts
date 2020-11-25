import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewLocationPage } from './new-location.page';

const routes: Routes = [
  {
    path: '',
    component: NewLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewLocationPageRoutingModule {}
