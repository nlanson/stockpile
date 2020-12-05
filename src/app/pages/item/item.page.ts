import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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

  locations: any;
  item: Observable<any>;
  itemValueArray = new Array();
  itemName: any;
  itemUnits: any;
  itemCategory: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private fbs: FirebaseService,
    private modalController: ModalController,
    private route: Router,
    private fb: FormBuilder
  ) {
    this.toolbarColour = "black";
   }

  async ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params["id"];
    });
    this.item = this.fbs.getItem(this.id);
    this.locations = this.fbs.getLocations();
    this.itemName = await this.fbs.getItemName(this.id);
    this.itemCategory = await this.fbs.getItemCategory(this.id);
    this.itemUnits = await this.fbs.getItemUnits(this.id);

  }
  
  deleteItem(id) {
    this.fbs.removeItem(id);
    this.route.navigate(['/tabs/items'])
  }

  pmOne(operator:string, location, value:number) {
    let newValue: Number;
    switch (operator) {
      case "+":
        newValue = value + 1;
        break;
      case "-":
        newValue = value - 1
        break;
      default:
        console.log("add/rm error item.page.ts (68)");
        break;
    }
    this.fbs.editItem(this.id, location, newValue);
    
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
