import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.page.html',
  styleUrls: ['./new-item.page.scss'],
})
export class NewItemPage implements OnInit {

  newItemForm: FormGroup;
  newItemName: string;
  locations: Observable<any[]>;
  locationsArray: any[];

  constructor(
    private fbs: FirebaseService,
    private fb: FormBuilder,
    private modalController: ModalController,
    private ac: AlertController
  ) { 
    this.locations = this.fbs.getLocations();
  }

  ngOnInit() {
    this.newItemForm = this.fb.group(
      {
        shortName: [null],
        longName: [null],
        units: [null],
        category: [null]
      }
    );
  }

  async submit() { //need validation
    let newItemShortName = this.newItemForm.value.shortName;
    let newItemLongName = this.newItemForm.value.longName;
    let newItemUnits = this.newItemForm.value.units;
    let newItemCategory = this.newItemForm.value.category;

    //Validating whether the submitted form has any null values (empty/unfilled)
    if ( (newItemShortName == null) || (newItemUnits == null) || (newItemCategory == null) ) {
      const alert = await this.ac.create({
        header: 'Invalid Input',
        message: `Item name, unit or category cannot be empty.`,
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
      newItemShortName = this.newItemForm.value.shortName.charAt(0).toUpperCase() + this.newItemForm.value.shortName.slice(1);
      if (newItemLongName != null) {
        newItemLongName = this.newItemForm.value.longName.charAt(0).toUpperCase() + this.newItemForm.value.longName.slice(1);
        console.log(newItemLongName);
      }
      newItemUnits = newItemUnits.charAt(0).toUpperCase() + newItemUnits.slice(1);
      this.fbs.addItem(newItemShortName, newItemLongName, newItemUnits, newItemCategory);
      this.newItemForm.reset();
      this.modalController.dismiss();
    }
  }


}
