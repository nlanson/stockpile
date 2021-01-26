import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Settings2 } from '../../modals/settings2/settings2.page';
import { InfoComponent } from '../../modals/info/info.component';
import { EditItemPage } from '../../modals/edit-item/edit-item.page';
import { EditItemDetailPage } from '../../modals/edit-item-detail/edit-item-detail.page'
import { FirebaseService } from '../../services/database/firebase.service';

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
    private fb: FormBuilder,
    private ac: AlertController
  ) {
    this.toolbarColour = "broccoGreen";
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
  
  async deleteItem(id) {
    const alert = await this.ac.create({
      header: 'Are you sure you want to delete this item?',
      message: `Delete means forever, unrecoverable. ${id}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (cancel) => {
            console.log('Cancelled Delete');
          }
        }, {
          text: 'Delete',
          handler: (del) => {
            this.fbs.removeItem(id);
            this.route.navigate(['/tabs/items'])
          }
        }
      ]
    });

    await alert.present();
  }

  async pmOne(operator:string, locationid:string, value:number) { //Plus Minus One Function.
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
    if ( newValue >= 0 || (newValue < 0 && operator == '+')) { //Only send to DB if the newValue is 0 or above since there cant be negative stock
      this.fbs.editItem(this.id, locationid, newValue);
    } else {
      const alert = await this.ac.create({ //present error alert that stock cant be negative.
        cssClass: '',
        header: 'Error',
        message: `You can't have a negative amount of ${this.itemMetaData.name}`,
        buttons: ['OK']
      });
      await alert.present();
    }//end IF
  }

  getColor(count, thresh, ignore) { //figures which stock warning colour should be used by comparing count and thresh.
    //console.log(count, thresh, ignore);
    if ( count > thresh+this.threshDifferenceValue && ignore == false) {
      return 'white';
    }
    else if ( count > thresh && ignore == false) {
      return `yellow`;
    }
    else if ( count <= thresh && ignore == false) {
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
      cssClass: 'settingsModal'
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
