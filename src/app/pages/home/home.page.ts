import { Component, ComponentRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router'

import { Settings2 } from '../../modals/settings2/settings2.page';
import { InfoComponent } from '../../modals/info/info.component';
import { NewLocationPage } from '../../modals/new-location/new-location.page';
import { FirebaseService } from '../../services/database/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  locations: Observable<any[]>;
  toolbarColour: string;

  constructor(
    private fbs: FirebaseService,
    private modalController: ModalController,
    private router: Router,
  ) {
    this.locations = this.fbs.getLocations();
    this.toolbarColour = "broccoGreen";
  }

  ngOnInit() {
    
  }

  trackByFn(location: any) {
    return location.id
  }
  
  async presentSettings() {
    const modal = await this.modalController.create({
      component: Settings2,
      swipeToClose: true,
      cssClass: 'settingsModal'
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
      cssClass: 'infoModal'
    });
    return await modal.present();
  }

  gotoLocPage(id) {
    //console.log(id);
    this.router.navigate(['/tabs/home/location', id]);
    
  }

}
