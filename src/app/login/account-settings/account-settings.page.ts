import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

import { timer } from 'rxjs';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.page.html',
  styleUrls: ['./account-settings.page.scss'],
})
export class AccountSettingsPage implements OnInit {

  email: string;
  password: string;
  LoginForm: FormGroup;
  savedUser: any;
  showLogin: boolean;
  accountExists: boolean;
  cAccount: any;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private ns: NativeStorage,
    private auth: AuthService,
    private ac: AlertController
  ) { 
    
    this.LoginForm = this.fb.group({
      email: [this.email, Validators.email],
      password: [null],
    });

  }

  async ngOnInit() {
    this.savedUser = await this.auth.getSavedAccounts();

    if( 
      (this.savedUser == null || undefined) ||
      (this.savedUser.email == null || undefined) ||
      (this.savedUser.password == null || undefined)
      ) {
        this.accountExists = false;
        this.showLogin = true;
      } else {
        this.accountExists = true;
      }

      timer(2000).subscribe(() => {
        console.log("asPage waited 2 seconds before checking credentials.")
        if( 
          (this.savedUser == null || undefined) ||
          (this.savedUser.email == null || undefined) ||
          (this.savedUser.password == null || undefined)
          ) {
            this.accountExists = false;
            this.showLogin = true;
          } else {
            this.accountExists = true;
          }
      });
  }

  refreshAccount() {
    if( 
      (this.savedUser == null || undefined) ||
      (this.savedUser.email == null || undefined) ||
      (this.savedUser.password == null || undefined)
      ) {
        this.presentAlert("Account set failed.");
        this.accountExists = false;
        this.showLogin = true;
      } else {
        this.accountExists = true;
      }
  }

  setAccount(){
    this.auth.setAccount(this.LoginForm.value.email, this.LoginForm.value.password);
    this.LoginForm.reset();

    this.savedUser = this.auth.getSavedAccounts();
    this.modalController.dismiss();
  }

  clearAccount() {
    this.presentDeleteAlert();
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

  async presentDeleteAlert() { //present alert
    const alert = await this.ac.create({
      header: 'Confirm Clear',
      message: 'Are you sure you want to  <strong>clear this account?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (cancel) => {
            console.log('Cancelled Delete');
          }
        }, {
          text: 'Clear',
          handler: (del) => {
            this.auth.setAccount(null, null);
            this.modalController.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }


  showLoginForm() {
    this.showLogin = true;
  }

  hideLoginForm() {
    this.showLogin = false;
  }

}
