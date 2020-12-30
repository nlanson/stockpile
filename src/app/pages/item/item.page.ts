import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IonInfiniteScroll } from '@ionic/angular';

import { Settings2 } from '../../modals/settings2/settings2.page';
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
  threshDifferenceValue: number;


  locations: any;
  item: Observable<any>;
  itemValueArray = new Array();
  itemMetaData: any = { // Values are preset here to prevent page rendering issues. 
    name: 'ItemName',  //  The values are updated straight away in ngOnInit() function to the values found in the database.
    units: 'PLACEHOLDER',
    category: "Veges"
  }


  constructor(
    private activatedRoute: ActivatedRoute,
    private fbs: FirebaseService,
    private modalController: ModalController,
    private route: Router,
    private fb: FormBuilder
  ) {
    this.toolbarColour = "black";
    this.threshDifferenceValue = this.fbs.getColorThreshDifferenceValue;
   }

  async ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params["id"];
    });
    this.item = this.fbs.getItem(this.id);
    this.locations = this.fbs.getLocations();
    this.itemMetaData = await this.fbs.getItemMetaData(this.id);

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
    if ( count > thresh+this.threshDifferenceValue ) {
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

  trackByFn(item: any) {
    return item.id
  }

  async presentSettings() {
    const modal = await this.modalController.create({
      component: Settings2,
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
    modal.onDidDismiss().then(async () => {
      this.itemMetaData = await this.fbs.getItemMetaData(this.id);
    })
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
