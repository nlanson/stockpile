import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-edit-item-detail',
  templateUrl: './edit-item-detail.page.html',
  styleUrls: ['./edit-item-detail.page.scss'],
})
export class EditItemDetailPage implements OnInit {

  itemId: string = this.navParams.get(`itemId`);
  locationId: string = this.navParams.get(`locationId`);

  item: any;

  ItemDetailForm: FormGroup;

  constructor( 
    private navParams: NavParams,
    private modalController: ModalController,
    private fbs: FirebaseService,
    private fb: FormBuilder,

    ) { }

  async ngOnInit() {
    this.item = await this.fbs.getItemMetaData(this.itemId);
    console.log(this.item[this.locationId].ignore);
    this.ItemDetailForm = this.fb.group({
      count: this.item[this.locationId].count,
      threshhold: this.item[this.locationId].threshhold,
      ignore: this.item[this.locationId].ignore
    })
  }

  submit() {
    this.fbs.editSpecificItemDetails(this.ItemDetailForm.value.count, this.ItemDetailForm.value.threshhold, this.ItemDetailForm.value.ignore, this.itemId, this.locationId);
    this.modalController.dismiss();
  }

}
