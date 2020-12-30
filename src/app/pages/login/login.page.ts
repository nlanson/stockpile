import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AccountSettingsPage } from './account-settings/account-settings.page';

import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { timer } from 'rxjs'



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  savedUser: any;

  showPinPad: boolean;
  toolbarColour: string;

  constructor(
    private auth: AuthService,
    private modalController: ModalController,
    private asc: AccountSettingsPage,
    private ns: NativeStorage,
    private ac: AlertController,
  ) {
    this.toolbarColour = "black";
   }

  async ngOnInit() {
      this.savedUser = await this.auth.getSavedAccounts();
  }

  async login() {
      this.savedUser = await this.auth.getSavedAccounts();

      if ( (this.savedUser.email != null) || (this.savedUser.password != null) || (this.savedUser.email != undefined) || (this.savedUser.password != null) ) {
        this.auth.login(this.savedUser.email, this.savedUser.password);
      } else {
        this.presentAlert("No account set.");
      }
    
  }

  async debugLogin() {
    this.auth.login('admin@t2g.com', 'admin1');
  }

  async presentSettings() {
    const modal = await this.modalController.create({
      component: AccountSettingsPage,
      swipeToClose: true,
      cssClass: 'loginSettingsModal'
    });
    return await modal.present();
  }

  async presentAlert(error: string) {
    const alert = await this.ac.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: error,
      buttons: ['OK']
    });

    await alert.present();
  }


}//end class
