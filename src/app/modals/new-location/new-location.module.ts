import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewLocationPageRoutingModule } from './new-location-routing.module';

import { NewLocationPage } from './new-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewLocationPageRoutingModule
  ],
  declarations: [NewLocationPage]
})
export class NewLocationPageModule {}
