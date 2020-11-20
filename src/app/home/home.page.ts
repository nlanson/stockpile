import { Component, ComponentRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { SettingsComponent } from './settings/settings.component';
import { InfoComponent } from './info/info.component';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  locations: Observable<any[]>;
  currentLocation: string;

  constructor(
    private fbs: FirebaseService,
    private modalController: ModalController,
    private auth: AuthService
  ) {
    this.locations = this.fbs.getLocations();
  }

  ngOnInit() {

  }
  
  async presentSettings() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      swipeToClose: true,
      cssClass: 'default-modal'
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

  showLocation(name) {
    this.currentLocation = name;
  }
}
