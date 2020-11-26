import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { SettingsComponent } from '../../modals/settings/settings.component';
import { InfoComponent } from '../../modals/info/info.component';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {

  sub: any;
  id: string;
  toolbarColour: string;

  locations: Observable<any>
  item: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fbs: FirebaseService,
    private modalController: ModalController,
    private route: Router,
  ) {
    this.toolbarColour = "black";
   }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params["id"];
    });
    this.item = this.fbs.getItem(this.id);
    this.locations = this.fbs.getLocations();
  }
  
  deleteItem(id) {
    console.log(id);
    this.fbs.removeItem(id);
    this.route.navigate(['/tabs/items'])
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

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}
