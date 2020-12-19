import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.page.html',
  styleUrls: ['./edit-location.page.scss'],
})
export class EditLocationPage implements OnInit {
  id:string = this.navParams.get(`id`);
  locInfo: any;
  editForm: FormGroup;

  constructor(
    private navParams: NavParams,
    private fbs: FirebaseService,
    private fb: FormBuilder,
    private modalController: ModalController
    ) { }

  async ngOnInit() {
    console.log(this.id);
    this.locInfo = await this.fbs.getLocationMetaData(this.id);

    this.editForm = this.fb.group({
      name: this.locInfo.name,
      type: this.locInfo.type
    })
  }

  submit() {
    this.fbs.editLocation(this.id, this.editForm.value.name, this.editForm.value.type);
    this.modalController.dismiss();
  }

}
