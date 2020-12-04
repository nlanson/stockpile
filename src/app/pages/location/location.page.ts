import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs'

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  sub: any;
  id: string;

  items: Observable<any[]>;
  locationMetaData:any;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private fbs: FirebaseService,

  ) { }

  async ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params["id"];
    });
    this.items = this.fbs.getItems();
    this.locationMetaData = await this.fbs.getLocationMetaData(this.id);

    console.log(this.locationMetaData);
  }


}
