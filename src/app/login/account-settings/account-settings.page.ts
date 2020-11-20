import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.page.html',
  styleUrls: ['./account-settings.page.scss'],
})
export class AccountSettingsPage implements OnInit {

  email: string;
  password: string;
  LoginForm: FormGroup;
  savedUser: {email, password};
  showLogin: boolean = false;
  accountExists: boolean;
  cAccount: any;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private ns: NativeStorage,
    private auth: AuthService
  ) { 
    
    this.LoginForm = this.fb.group({
      email: [this.email, Validators.email],
      password: [null],
    });

  }

  ngOnInit() {
    this.getSavedAccount();
    this.refreshAccount();
    console.log("saved user email: " + this.savedUser.email);
  }

  refreshAccount() {
    if( this.savedUser.email == undefined || null ) {
      console.log("user not set");
      this.accountExists = false;
    } else {
      this.accountExists = true;
      this.email = this.savedUser.email;
      this.password = this.savedUser.password;
      console.log("Account Exists: " + this.accountExists);
      console.log(this.email);
    }
  }

  setAccount() {
    this.email = this.LoginForm.value.email;
    this.password = this.LoginForm.value.password;
    this.ns.setItem('account', {email: this.email, password: this.password})
    .then(
      () => console.log('Stored account!'),
      error => console.error('Error storing item', error)
    );
    this.refreshAccount();
  }

  getSavedAccount() {
    this.ns.getItem('account')
    .then(data=>
      {
        this.savedUser = data;
      });
  }


  showLoginForm() {
    this.showLogin = true;
  }

}
