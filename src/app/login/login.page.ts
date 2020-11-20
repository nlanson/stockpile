import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AccountSettingsPage } from './account-settings/account-settings.page';

import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  savedUser: any;

  constructor(
    private auth: AuthService,
    private modalController: ModalController,
    private asc: AccountSettingsPage,
    private ns: NativeStorage,
    private ac: AlertController,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.platform.ready().then(async () => {
      await this.getAccount();

      if( this.savedUser == undefined || null ) {
        this.presentSettings();
      }
    });
  }
    
    
    
    //on load, check native storage for any saved accounts, and if empty, open LoginSettings Modal.
    //if not empty, prompt login with faio/pin


  async login() {
    await this.getAccount();

    if ( this.savedUser.email || this.savedUser.password != null) {
      this.auth.login(this.savedUser.email, this.savedUser.password);
    } else {
      this.presentAlert("No account set.")
    }
    
  }

  async presentSettings() {
    const modal = await this.modalController.create({
      component: AccountSettingsPage,
      swipeToClose: true,
      cssClass: 'default-modal'
    });
    return await modal.present();
  }

  getAccount() {
    return new Promise((resolve, reject) => {
      this.ns.getItem('account')
      .then(data=>
        {
          this.savedUser = data;
          resolve("resolved");
        });
    });
  }

  async presentAlert(error) {
    const alert = await this.ac.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: error,
      buttons: ['OK']
    });

    await alert.present();
  }


}
