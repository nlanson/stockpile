import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router'

import { Settings2 } from '../../modals/settings2/settings2.page';
import { InfoComponent } from '../../modals/info/info.component';
import { NewItemPage } from '../../modals/new-item/new-item.page';
import { FirebaseService } from '../../services/database/firebase.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  toolbarColour: string;
  items: any;
  categories = [
    "Veges",
    "Meat",
    "Other"
  ]
  public searchArray: any;
  itemTotals: any;

  constructor(
    private fbs: FirebaseService,
    private modalController: ModalController,
    private router: Router,
  ) {
    this.items = this.fbs.getItems();
    this.toolbarColour = "broccoGreen";
   }

  ngOnInit() {
    let totalsObj = {};
    this.items = this.fbs.getItems();

    //This section is extracting the count of easch item at each location and tallying the total amount of each item.
    this.items.forEach(items => {
      items.forEach(item => {
        let keysArray = Object.keys(item); //Array of every key in an item object.
        let totalForItem: number = 0; //To tally the total amount of an item accross all locations.
        keysArray.forEach(key => { //Traversing the item Object keys and only using the Object keys that arent equal to category, name, id or units.
          if (key == `category` || key == 'id' || key == 'name' || key == 'units') { //This is done because the item Obj is made of the 4 unwanted keys + 4 randomly generated keys that we do not know of.
            /*for some reason i cant do 
              if (key != 'category' || key != 'id' ...) {}  because of some raondom error.
            */
          } else {
            //console.log(item[key].count)
            totalForItem = totalForItem + item[key].count;
            totalsObj[item.name] = totalForItem;
          }
        });
      });
    });

    this.itemTotals = totalsObj;
  }

  gotoItemPage(id) {
    this.router.navigate(['/tabs/items/item', id]);
  }

  async filterList(evt) {
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm || searchTerm == '') {
      //console.log(searchTerm)
      this.searchArray = false;
      return;
    }

    this.searchArray = await this.fbs.getItemsBySearchTerm(searchTerm);
    
  }

  async presentSettings() {
    const modal = await this.modalController.create({
      component: Settings2,
      swipeToClose: true,
      cssClass: 'settingsModal'
    });
    return await modal.present();
  }

  async presentNewItemModal() {
    const modal = await this.modalController.create({
      component: NewItemPage,
      swipeToClose: true,
      cssClass: 'newItemModal'
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

  trackByFn(item: any) {
    return item.id
  }

}
