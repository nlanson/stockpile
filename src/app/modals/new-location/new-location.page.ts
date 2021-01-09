import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.page.html',
  styleUrls: ['./new-location.page.scss'],
})
export class NewLocationPage implements OnInit {

  newLocationForm: FormGroup;
  formFailed: boolean = false;

  constructor(
    private fbs: FirebaseService,
    private fb: FormBuilder,
    private modalController: ModalController,
    private ac: AlertController
  ) { }

  ngOnInit() {
    this.newLocationForm = this.fb.group(
      {
        newLocationName: [null],
        newLocationType: [null]
      }
    );
  }

  async submit() {
    console.log("newlocation submitted");
    let newLocName = this.newLocationForm.value.newLocationName;
    let newLocType = this.newLocationForm.value.newLocationType;

    //Validating whether the submitted form has any null values (empty/unfilled)
    if((newLocName == null) || (newLocType == null)) {
      const alert = await this.ac.create({
        header: 'Invalid Input',
        message: `Location name or type cannot be empty`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (cancel) => {
              this.modalController.dismiss()
            }
          }, {
            text: 'Retry',
            handler: (del) => {
              
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.fbs.addLocation(newLocName, newLocType);
      this.newLocationForm.reset();
      this.modalController.dismiss();
    }
  }

}
