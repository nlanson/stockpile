import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { SettingsComponent } from '../../modals/settings/settings.component';
import { InfoComponent } from '../../modals/info/info.component';
import { EditItemPage } from '../../modals/edit-item/edit-item.page';
import { EditItemDetailPage } from '../../modals/edit-item-detail/edit-item-detail.page'
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
  
  public itemName: any;
  public itemUnits: any;
  public itemCategory: any;


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

  pmOne(operator:string, locationid:string, value:number) {
    let newValue: Number;
    switch (operator) {
      case "+":
        newValue = value + 1;
        break;
      case "-":
        newValue = value - 1
        break;
      default:
        console.log("add/rm error item.page.ts (71)");
        break;
    }
    this.fbs.editItem(this.id, locationid, newValue);
    
  }

  getColor(count, thresh, ignore) {
    if ( ignore == true ) {
      return 'white';
    } 
    else {
      if ( count*0.9 > thresh ) {
        return 'white';
      }
      else if ( count > thresh ) {
        return `yellow`;
      }
      else if ( count <= thresh ) {
        return 'red';
      } 
      else {
        return 'white';
      }
    }
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

  async presentEditItem() {
    const modal = await this.modalController.create({
      component: EditItemPage,
      swipeToClose: true,
      cssClass: 'editItemDetailModal',
      componentProps: {
        itemId: this.id
      }
    });
    return await modal.present();
    
  }

  async presentDetailedEdit(locationId) {
    const modal = await this.modalController.create({
      component: EditItemDetailPage,
      swipeToClose: true,
      cssClass: 'editItemDetailModal',
      componentProps: {
        itemId: this.id,
        locationId: locationId
      }
    });
    return await modal.present();
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}

/*
<ion-item *ngIf="info.key != 'id' && info.key != 'name' && info.key != 'units' && info.key != 'category'">
      <ion-grid>
        <ion-row>
          <ion-col> <!--Location Label-->
            <span class="locationName" [style.color]='getColor(info.value.count, info.value.threshhold, info.value.ignore)'>{{info.value.locationName}} - </span>
          </ion-col>

          <ion-col size="auto" class="infoCol"> <!--Info and Plus Minus Buttons-->
            <ion-button class="pmButton" (click)="pmOne('-', info.key, info.value.count)" color="danger"  >-</ion-button> <!--fab-button causing flickering on update.-->
            <span class=" info">{{info.value.count}}  {{itemUnits}}</span>
            <ion-button class="pmButton" (click)="pmOne('+', info.key, info.value.count)" color="success" >+</ion-button>
          </ion-col>

          <ion-col> <!--Edit Button-->
            <ion-buttons (click)="presentDetailedEdit(info.key)" ><ion-icon name="create-outline" class="editButton"></ion-icon></ion-buttons>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-item>
*/
