import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { FirebaseService } from '../../services/database/firebase.service';


@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
})
export class EditItemPage implements OnInit {

  itemId:string = this.navParams.get(`itemId`);
  item: any;
  editForm: FormGroup;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private fbs: FirebaseService,
    private fb: FormBuilder,
  ) { }

  async ngOnInit() {
    this.item = await this.fbs.getItemMetaData(this.itemId);

    this.editForm = this.fb.group({
      name: this.item.name,
      category: this.item.category,
      units: this.item.units
    })
  }

  submit() {
    let ef = this.editForm.value;
    this.fbs.editItemInfo(this.itemId, ef.name, ef.category, ef.units);
    
    this.modalController.dismiss();
  }

}
