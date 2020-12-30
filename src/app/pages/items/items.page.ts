import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router'

import { Settings2 } from '../../modals/settings2/settings2.page';
import { InfoComponent } from '../../modals/info/info.component';
import { NewItemPage } from '../../modals/new-item/new-item.page';
import { FirebaseService } from '../../services/firebase.service';

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

  constructor(
    private fbs: FirebaseService,
    private modalController: ModalController,
    private router: Router,
  ) {
    this.items = this.fbs.getItems();
    this.toolbarColour = "black";
   }

  ngOnInit() {
    this.items = this.fbs.getItems();
  }

  gotoItemPage(id) {
    this.router.navigate(['/tabs/items/item', id]);
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

  async presentSettings() {
    const modal = await this.modalController.create({
      component: Settings2,
      swipeToClose: true,
      cssClass: 'default-modal'
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
      cssClass: 'default-modal'
    });
    return await modal.present();
  }

  trackByFn(item: any) {
    return item.id
  }

}
