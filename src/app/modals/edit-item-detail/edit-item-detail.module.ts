import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditItemDetailPageRoutingModule } from './edit-item-detail-routing.module';

import { EditItemDetailPage } from './edit-item-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditItemDetailPageRoutingModule
  ],
  declarations: [EditItemDetailPage]
})
export class EditItemDetailPageModule {}
