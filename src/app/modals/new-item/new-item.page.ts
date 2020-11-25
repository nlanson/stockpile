import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
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
    private modalController: ModalController
  ) { 
    this.locations = this.fbs.getLocations();
  }

  ngOnInit() {
    this.newItemForm = this.fb.group(
      {
        newItemName: [null]
      }
    );
  }

  submit() {
    this.fbs.addItem(this.newItemForm.value.newItemName);
    this.newItemForm.reset();
    this.modalController.dismiss();
  }

}
