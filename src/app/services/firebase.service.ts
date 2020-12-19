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
    return this.fdb.object(`items/${id}`).valueChanges();
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

  getItemCategory(id) {
    let itemCategory: string;
    
    return new Promise((resolve, reject) => {
      let sub = this.fdb.list('items').snapshotChanges().subscribe(item => {
        console.log("get item units sub")
        item.forEach(item => {
          let itemInfo:any = item.payload.val();
          if( itemInfo.id == id ) {
            itemCategory = itemInfo.category;
            resolve(itemCategory);
          }
        })
        sub.unsubscribe();
      })
    })
  }

  editItem(itemid, locationid, newValue) {
    console.log("edit item");
    this.fdb.object(`items/${itemid}/${locationid}`).update({count: newValue});
  }

  addItem(itemName: string, units: string, category: string) {
    itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
    let item = {
      name: itemName,
      units: units,
      category: category
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
            [locationInfo.id]: { 
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
            this.fdb.object(`items/${itemInfo.id}/${ref.key}`).set({
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

  removeLocation(locationid) {
    this.fdb.object(`locations/${locationid}`).remove().then(() => {
      let sub = this.fdb.list(`items`).snapshotChanges().subscribe(item => {
        console.log('rem loc sub');
        item.forEach(item => {
          let itemInfo: any = item.payload.val();
          this.fdb.object(`items/${itemInfo.id}/${locationid}`).remove();
        })
        sub.unsubscribe();
      })
    })
  }

  getLocationMetaData(id) { 
    return new Promise((resolve, reject) => {
      let sub = this.fdb.object(`locations/${id}`).snapshotChanges().subscribe((res) => {
        let info = res.payload.val();
        sub.unsubscribe();
        resolve(info);
      });
    });
  }



  getStockForSingleLocationTest(){
    let locationName = "Cromwell"
    let sub = this.fdb.list(`items`).snapshotChanges().subscribe(item => {
      item.forEach(item => {
        let itemInfo:any = item.payload.val();
        console.log(itemInfo.name + itemInfo[locationName].count);
      })
      sub.unsubscribe();
    })
  }



}//end class
