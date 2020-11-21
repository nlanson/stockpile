import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AccountSettingsPage } from './account-settings/account-settings.page';

import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
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
    private faio: FingerprintAIO
  ) {
    this.toolbarColour = "black";
   }

  async ngOnInit() {
      this.savedUser = await this.auth.getSavedAccounts();
  }

  async login() {
    this.savedUser = await this.auth.getSavedAccounts();

    if ( this.savedUser.email || this.savedUser.password != undefined || null) {
      let idAvail = await this.faio.isAvailable();
      
        this.faio.show({
          title: 'Login', // (Android Only) | optional |
          subtitle: 'Unlock to use', // (Android Only) | 
          description: 'Login', // optional | 
          fallbackButtonTitle: 'Use Backup', // optional | 
        }).then(() => {
          this.auth.login(this.savedUser.email, this.savedUser.password);
        })
        .catch((error: any) => {
          console.log('err: ', error);
        });
    } else {
      this.presentAlert("No account set.");
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

  async presentAlert(error: string) {
    const alert = await this.ac.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: error,
      buttons: ['OK']
    });

    await alert.present();
  }


}
