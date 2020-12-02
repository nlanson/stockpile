 import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
import { timer } from 'rxjs';

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
    let scope = searchTerm.length;
    return new Promise((resolve, reject) => {
      let ResultsArray = [];
      let sub;
      sub = this.fdb.list('items'/*, ref => ref.orderByChild('name').equalTo(searchTerm)*/).snapshotChanges().subscribe((res) => {
        res.forEach((rresult) => {
          let result: any = rresult.payload.val();
          if( result.name.substr(0, scope) == searchTerm ) {
            ResultsArray.push(result)
          }
        });
        sub.unsubscribe();
      })
      resolve(ResultsArray)
    })
  }

  getItem(id) {
    return this.fdb.list(`items/${id}`).valueChanges();
  }

  getItemName(id) {
    let itemName: string;
    
    return new Promise((resolve, reject) => {
      let sub = this.fdb.list('items').snapshotChanges().subscribe(item => {
        console.log("get item name sub")
        item.forEach(item => {
          let itemInfo:any = item.payload.val();
          //console.log(itemInfo);
          if( itemInfo.id == id ) {
            itemName = itemInfo.name;
            resolve(itemName);
          }
        })
        sub.unsubscribe();
      })
    })
  }

  getItemUnits(id) {
    let itemUnits: string;
    
    return new Promise((resolve, reject) => {
      let sub = this.fdb.list('items').snapshotChanges().subscribe(item => {
        console.log("get item units sub")
        item.forEach(item => {
          let itemInfo:any = item.payload.val();
          if( itemInfo.id == id ) {
            itemUnits = itemInfo.units;
            resolve(itemUnits);
          }
        })
        sub.unsubscribe();
      })
    })
  }

  editItem(id, location, newValue) {
    console.log("edit item");
    this.fdb.object(`items/${id}/${location}`).update({count: newValue});
  }

  addItem(itemName: string, units: string) {
    itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
    let item = {
      name: itemName,
      units: units
    }
    this.fdb.list(`items`).push(item).then((ref) => {
      this.fdb.object(`items/${ref.key}`)
      ref.update({ id: ref.key })

      let sub = this.fdb.list(`locations`).snapshotChanges().subscribe(location => {
        console.log('add item sub');
        location.forEach(location => {
          let locationInfo:any = location.payload.val();
          ref.update(
            {
            [locationInfo.name]: { 
              locationName: `${locationInfo.name}`,
              count: 0
            }
          })
        })
        sub.unsubscribe();
      })
    })
  }

  removeItem(id) {
    console.log(`removing ${id}`);
    this.fdb.object("items/" + id).remove().then((ref) => {
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

        let sub = this.fdb.list(`items`).snapshotChanges().subscribe(item => {
          console.log('add loc sub')
          item.forEach(item => {
            let itemInfo:any = item.payload.val();
            console.log(itemInfo);
            this.fdb.object(`items/${itemInfo.id}/${locationName}`).set({
              locationName: `${locationName}`,
              count: 0
            })
          })
          sub.unsubscribe();
        })

      }, (error) => {
        console.error(error);
      })
  }

  removeLocation(locationid, locationName) {
    this.fdb.object(`locations/${locationid}`).remove().then(() => {
      let sub = this.fdb.list(`items`).snapshotChanges().subscribe(item => {
        console.log('rem loc sub');
        item.forEach(item => {
          let itemInfo: any = item.payload.val();
          this.fdb.object(`items/${itemInfo.id}/${locationName}`).remove();
        })
        sub.unsubscribe();
      })
    })
  }



  getStockForSingleLocationTest(){
    let locationName = "Cromwell"
    let sub = this.fdb.list(`items`).snapshotChanges().subscribe(item => {
      item.forEach(item => {
        let itemInfo:any = item.payload.val();
        console.log(itemInfo[locationName].count);
      })
    })
    
  }



}//end class
