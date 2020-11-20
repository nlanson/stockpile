import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AccountSettingsPage } from './account-settings/account-settings.page';

import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';



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
    private platform: Platform,
    private faio: FingerprintAIO
  ) {
    this.toolbarColour = "black";
   }

  ngOnInit() {
    this.platform.ready().then(async () => {
      this.savedUser = this.auth.getSavedAccounts();

      if( 
        (this.savedUser == null || undefined) ||
        (this.savedUser.email == null || undefined) ||
        (this.savedUser.password == null || undefined)
        ) {
          this.presentSettings();
        }
    });
  }
    
    
    
    //on load, check native storage for any saved accounts, and if empty, open LoginSettings Modal.
    //if not empty, prompt login with faio/pin


  async login() {
    this.savedUser = this.auth.getSavedAccounts();

    if ( this.savedUser.email || this.savedUser.password != undefined || null) {
      let idAvail = await this.faio.isAvailable();
      if ( idAvail == true ) {
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
        this.presentAlert("No login method detected.")
      }
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
