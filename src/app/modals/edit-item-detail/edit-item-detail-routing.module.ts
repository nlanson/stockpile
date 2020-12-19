import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditItemDetailPage } from './edit-item-detail.page';

const routes: Routes = [
  {
    path: '',
    component: EditItemDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditItemDetailPageRoutingModule {}
