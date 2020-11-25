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

  getItems() {
    return this.fdb.list('items').valueChanges();
  }

  getItem(id) {
    let i = 0;
    let itemData = new Array();
    this.fdb.list(`items/${id}`).snapshotChanges().forEach(item => {
      item.forEach(item => {
        itemData[i] = item.payload.val();
        console.log(item.payload.key + " : " + itemData[i]);
        i++;
      })
    });
    return itemData;
  }

  addItem(itemName) {
    let item = {
      name: itemName
    }

    this.fdb.list("items").push(item)
      .then((ref) => {
        console.log(ref);
        this.fdb.object('items/' + ref.key)
        ref.update({ id: ref.key })
        
        this.fdb.list('locations').snapshotChanges().forEach(location => {
          location.forEach(location => {
            let locationName =  location.payload.val();
            ref.update({[locationName.name]: 0 })
          });
        });
      }, (error) => {
        console.error(error);
      })
  }

  addLocation(locationName, locationType) {
    let location = {
      name: locationName,
      type: locationType
    }
    
    this.fdb.list('locations').push(location)
      .then((ref) => {
        console.log(ref);
        this.fdb.object('locations/' + ref.key)
        ref.update({ id: ref.key })

        this.fdb.list('items').snapshotChanges().forEach(item => {
          item.forEach(item => {
            this.fdb.list(`items`).update(item.payload.key, {[locationName]: 0})
          })
        }); //end for each item

      }, (error) => {
        console.error(error);
      })
  }

  removeLocation(locationid, locationName) {
    this.fdb.object("locations/" + locationid).remove()
        .then((ref) => {
          this.fdb.list('items').snapshotChanges().forEach(item => {
            item.forEach(item => {
              this.fdb.list(`items`).update(item.payload.key, {[locationName]: null})
            })
          }); //end for each item
        }, (error) => {
          console.error(error);
        })
  }
}
