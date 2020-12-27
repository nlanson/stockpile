import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs'

import { FirebaseService } from '../../services/firebase.service';
import { SettingsComponent } from '../../modals/settings/settings.component';
import { InfoComponent } from '../../modals/info/info.component';
import { EditLocationPage } from '../../modals/edit-location/edit-location.page';
import { NewItemPage } from '../../modals/new-item/new-item.page';
import { EditItemDetailPage } from '../../modals/edit-item-detail/edit-item-detail.page'

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
  public searchArray: any;

  categories = [
    "Veges",
    "Meat",
    "Other"
  ]
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private fbs: FirebaseService,
    private modalController: ModalController,
    private router: Router
  ) {
    this.toolbarColour = "black";
   }

  async ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params["id"];
    });
    this.items = this.fbs.getItems();
    this.locationMetaData = await this.fbs.getLocationMetaData(this.id); // await is too long and causes routing errors
    this.locationName = this.locationMetaData.name;
  }

  pmOne(operator, itemid, value) {
    let newValue: Number;
    switch (operator) {
      case "+":
        newValue = value + 1;
        break;
      case "-":
        newValue = value - 1
        break;
      default:
        console.log("add/rm error location.page.ts (61)");
        break;
    }
    this.fbs.editItem(itemid, this.id, newValue);
  }

  deleteLocation() {
    console.log("del");
    this.router.navigate(['/tabs/home/']);
    this.fbs.removeLocation(this.id);
  }

  getColor(count, thresh) {
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

  gotoItemPage(id) {
    this.router.navigate([`/tabs/items/item/${id}`])
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

  async presentLocEditModal() {
    const modal = await this.modalController.create({
      component: EditLocationPage,
      swipeToClose: true,
      cssClass: 'editLocModal',
      componentProps: { 
        id: this.id,
      }
    });
    return await modal.present();
  }

  async presentDetailedEdit(itemid, locationId) {
    const modal = await this.modalController.create({
      component: EditItemDetailPage,
      swipeToClose: true,
      cssClass: 'editItemDetailModal',
      componentProps: {
        itemId: itemid,
        locationId: locationId
      }
    });
    return await modal.present();
  }

  async presentNewItemModal() {
    const modal = await this.modalController.create({
      component: NewItemPage,
      swipeToClose: true,
      cssClass: 'newItemModal',
      componentProps: { 
        id: this.id,
      }
    });
    return await modal.present();
  }

  async filterList(evt) {
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm || searchTerm == '') {
      console.log(searchTerm)
      this.searchArray = false;
      return;
    }

    this.searchArray = await this.fbs.getItemsBySearchTerm(searchTerm);
    
  }

  trackByFn(item: any) {
    return item.id
  }
}
