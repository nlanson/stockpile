import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NewLocationPage } from '../../modals/new-location/new-location.page';



@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  currentUser: any;

  constructor(
    private auth: AuthService,
    private modalController: ModalController
  ) { 
    this.currentUser = this.auth.cUser;
    console.log(this.currentUser);
  }

  ngOnInit() {

  }

  logout() {
    this.modalController.dismiss();
    this.auth.logout();
  }

  setDisplayName() {
    this.auth.updateDisplayName();
  }

  async presentNewLocationModal() {
    const modal = await this.modalController.create({
      component: NewLocationPage,
      swipeToClose: true,
      cssClass: 'newLocationModal'
    });
    return await modal.present();
  }

}
