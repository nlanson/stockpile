import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.page.html',
  styleUrls: ['./new-location.page.scss'],
})
export class NewLocationPage implements OnInit {

  newLocationForm: FormGroup;

  constructor(
    private fbs: FirebaseService,
    private fb: FormBuilder,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.newLocationForm = this.fb.group(
      {
        newLocationName: [null],
        newLocationType: [null]
      }
    );
  }

  submit() {
    console.log("newlocation lol");
    this.fbs.addLocation(this.newLocationForm.value.newLocationName, this.newLocationForm.value.newLocationType);
    this.newLocationForm.reset();
  }

}
