import { Component, ComponentRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';

import { SettingsComponent } from '../../modals/settings/settings.component';
import { InfoComponent } from '../../modals/info/info.component';
import { NewLocationPage } from '../../modals/new-location/new-location.page';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  locations: Observable<any[]>;
  currentLocation: string;
  toolbarColour: string;

  constructor(
    private fbs: FirebaseService,
    private modalController: ModalController,
  ) {
    this.locations = this.fbs.getLocations();
    this.toolbarColour = "black";
  }

  ngOnInit() {
    this.fbs.getStockForSingleLocationTest();
  }
  
  async presentSettings() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      swipeToClose: true,
      cssClass: 'default-modal'
    });
    return await modal.present();
  }

  async presentNewLocationModal() {
    const modal = await this.modalController.create({
      component: NewLocationPage,
      swipeToClose: true,
      cssClass: 'newLocationModal'
    });
    return await modal.present();
  }
  
  async presentInfo() {
    const modal = await this.modalController.create({
      component: InfoComponent,
      swipeToClose: true,
      cssClass: 'default-modal'
    });
    return await modal.present();
  }

  removeLocation(id, name) {
    this.fbs.removeLocation(id, name);
  }
}
