import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { SettingsComponent } from './settings/settings.component';

import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertController } from '@ionic/angular';



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
    private sc: SettingsComponent,
    private ns: NativeStorage,
    private ac: AlertController
  ) { }

  ngOnInit() {
    this.getAccount();
    
    //on load, check native storage for any saved accounts, and if empty, open LoginSettings Modal.
    //if not empty, prompt login with faio/pin
  }


  login() {
    this.getAccount();

    if ( this.savedUser.user || this.savedUser.pass != null) {
      this.auth.login(this.savedUser.email, this.savedUser.pass);
    } else {
      this.presentAlert("No account set.")
    }
    
  }

  async presentSettings() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      swipeToClose: true,
      cssClass: 'default-modal'
    });
    return await modal.present();
  }

  getAccount() {
    this.savedUser = this.ns.getItem('account');
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
