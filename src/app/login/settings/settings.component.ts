import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  email: string;
  password: string;
  LoginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private ns: NativeStorage
  ) { 
    
    this.LoginForm = this.fb.group({
      user: [null, Validators.email],
      key: [null],
    });

  }

  ngOnInit() {
    
  }

  onSubmit() {
    this.ns.setItem('account', {user: "admin@t2g.com", pass: "admin1"})
    .then(
      () => console.log('Stored account!'),
      error => console.error('Error storing item', error)
    );
    
    this.modalController.dismiss();

  }

  
}
