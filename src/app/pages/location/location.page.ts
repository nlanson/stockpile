import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs'

import { FirebaseService } from '../../services/firebase.service';
import { SettingsComponent } from '../../modals/settings/settings.component';
import { InfoComponent } from '../../modals/info/info.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  sub: any;
  id: string;
  toolbarColour: string;

  items: Observable<any[]>;
  locationMetaData:any;
  locationName: string;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private fbs: FirebaseService,
    private modalController: ModalController,

  ) {
    this.toolbarColour = "black";
   }

  async ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params["id"];
    });
    this.items = this.fbs.getItems();
    this.locationName = "Cromwell" //LocationName hardcoded. need to adjust
    this.locationMetaData = await this.fbs.getLocationMetaData(this.id); // await is too long and causes routing errors

    console.log(this.locationMetaData);
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


}
