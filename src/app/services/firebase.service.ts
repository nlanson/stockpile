import { Injectable, ɵConsole } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
import { map, subscribeOn, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public fdb: AngularFireDatabase,
  ) { }

  getItems() {
    return this.fdb.list('items').valueChanges();
  }
  
  getItemsBySearchTerm(searchTerm) {
    searchTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
    return new Promise((resolve, reject) => {
      let tempArray = [];
      this.fdb.list('items', ref => ref.orderByChild('name').equalTo(searchTerm)).snapshotChanges().subscribe((res) => {
        res.forEach((ele) => {
          tempArray.push(ele.payload.val())
        });
      })
      resolve(tempArray)
    })
  }

  getItem(id) {
    return this.fdb.list(`items/${id}`).valueChanges();
  }

  editItem(id, location, newValue) {
    this.fdb.object(`items/${id}/${location}`).update({count: newValue});
  }

  addItem(itemName: string) {
    itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
    let item = {
      name: itemName
    }

    this.fdb.list("items").push(item)
      .then((ref) => {
        console.log(ref);
        this.fdb.object('items/' + ref.key)
        ref.update({ id: ref.key })
        
        this.fdb.list('locations').snapshotChanges().forEach(location => {
          console.log(`ovc 3`);
          location.forEach(location => {
            let locationName:any =  location.payload.val();
            ref.update({[locationName.name]: { locationName:[locationName.name], count:0} })
          });
        });
      }, (error) => {
        console.error(error);
      })
  }

  removeItem(id) {
    console.log(`removing ${id}`);
    this.fdb.object("items/" + id).remove()
        .then((ref) => {
          console.log("success");
        }, (error) => {
          console.error(error);
        })
  }

  getLocations() {
    return this.fdb.list('locations').valueChanges();
  }
  
  getLocationsArray() {
    return new Promise((resolve, reject) => {
      let i = 0;
      let locationArray = [];
      this.fdb.list(`locations`).snapshotChanges().forEach(location => {
        location.forEach(location => {
          let locationName:any = location.payload.val();
          locationName = locationName.name;
          locationArray.push(locationName);
        })
      });
      
      resolve(locationArray)
    })
  }

  addLocation(locationName, locationType) {
    let location = {
      name: locationName,
      type: locationType
    }
    
    this.fdb.list('locations').push(location)
      .then((ref) => {
        //console.log(ref);
        this.fdb.object('locations/' + ref.key)
        ref.update({ id: ref.key })

        this.fdb.list('items').snapshotChanges().forEach(item => {
          console.log(`ovc5`)
          item.forEach(item => {
            let itemInfo: any = item.payload.val();
            console.log(itemInfo.id, locationName)
            this.fdb.object(`items/${itemInfo.id}/${locationName}`).set({
              locationName: [locationName],
              count: 0
            });
            //this.fdb.list(`items/${item.id}`).update(`${locationName}`, {locationName: `${locationName}`});
            //this.fdb.list(`items/${item.id}`).update(`${locationName}`, {count: 0});
          })
        }); //end for each item

      }, (error) => {
        console.error(error);
      })
  }

  removeLocation(locationid, locationName) {
    this.fdb.object(`locations/${locationid}`).remove().then(() => {
      this.fdb.list(`items`).snapshotChanges().forEach(item => {
        console.log('ovc6')
        item.forEach(item => {
          let itemInfo: any = item.payload.val();
          console.log(`item/${itemInfo.id}/${locationName}`);
          this.fdb.object(`item/${itemInfo.id}/${locationName}`).remove();
          /*
           
            LINE 131
                The line for some reason is not removing the deleted location from the item.
                Maybe could try:
                      update(), set() or google

          */
        })
      })
    })
  }



}//end class
