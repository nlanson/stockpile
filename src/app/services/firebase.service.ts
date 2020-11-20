import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public fdb: AngularFireDatabase,
  ) { }

  getLocations() {
    return this.fdb.list('locations').valueChanges();
  }
}
