import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Settings2PageRoutingModule } from './settings2-routing.module';

import { Settings2 } from './settings2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Settings2PageRoutingModule
  ],
  declarations: [Settings2]
})
export class Settings2PageModule {}
