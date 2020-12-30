import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { NewLocationPage } from '../../modals/new-location/new-location.page';
import { EditLocationPage } from '../../modals/edit-location/edit-location.page';

@Component({
  selector: 'app-settings2',
  templateUrl: './settings2.page.html',
  styleUrls: ['./settings2.page.scss'],
})

export class Settings2 implements OnInit {

  currentUser: any;
  locations: any;
  locationForm: FormGroup;

  constructor(
    private auth: AuthService,
    private modalController: ModalController,
    private fbs: FirebaseService,
    private fb: FormBuilder,
    private ac: AlertController,
  ) { 
    this.currentUser = this.auth.cUser;
    this.locations = this.fbs.getLocations();
  }

  ngOnInit() {
    this.locationForm = this.fb.group({
      location: [null]
    })
  }

  logout() {
    this.modalController.dismiss();
    this.auth.logout();
  }

  setDisplayName() {
    this.auth.updateDisplayName();
  }

  async openEditModal() {
    let locationid = this.locationForm.value.location.id;
    this.locationForm.reset();
    const modal = await this.modalController.create({
      component: EditLocationPage,
      swipeToClose: true,
      cssClass: 'editLocModal',
      componentProps: { 
        id: locationid,
      }
    });
    return await modal.present();
  }

  async deleteLocation() {
    let locationid = this.locationForm.value.location.id;
    let locationName = this.locationForm.value.location.name;
    this.locationForm.reset();
    const alert = await this.ac.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to <strong>remove</strong> ${locationName}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (cancel) => {
            console.log('Cancelled Delete');
          }
        }, {
          text: 'Remove',
          handler: (del) => {
            this.fbs.removeLocation(locationid);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentNewLocationModal() {
    const modal = await this.modalController.create({
      component: NewLocationPage,
      swipeToClose: true,
      cssClass: 'newLocationModal'
    });
    return await modal.present();
  }

}