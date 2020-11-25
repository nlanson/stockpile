import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  currentUser: any;

  constructor(
    private auth: AuthService,
    private ModalController: ModalController
  ) { 
    this.currentUser = this.auth.cUser;
    console.log(this.currentUser);
  }

  ngOnInit() {

  }

  logout() {
    this.ModalController.dismiss();
    this.auth.logout();
  }

  setDisplayName() {
    this.auth.updateDisplayName();
  }

}
