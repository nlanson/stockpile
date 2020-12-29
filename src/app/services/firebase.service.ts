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

  addItem(itemName: string, units: string, category: string) { //Add a new Item
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
              count: 0,
              threshhold: 0,
              ignore: false
            }
          })
        })
        sub.unsubscribe();
      })
    })
  }

  removeItem(id) { //Delete an Item
    console.log(`removing ${id}`);
    this.fdb.object("items/" + id).remove().then((ref) => {
      console.log("success");
      }, (error) => {
        console.error(error);
      })
  }
  
  getItems() { //Live Reload Information for ALL items
    return this.fdb.list('items').valueChanges();
  }
  
  getItemsBySearchTerm(searchTerm) { //Getting items via search term (Returns an array of items that match the search term.)
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

  getItem(id) { // Live Reload Information for a  SINGLE item (ValueChanges => Stock Count)
    return this.fdb.object(`items/${id}`).valueChanges();
  }

  getItemMetaData(id) { //Static Data (Category, ID, Name and Units)
    return new Promise((resolve, reject) => {
      let sub = this.fdb.object(`items/${id}`).snapshotChanges().subscribe((res) => {
        let info = res.payload.val();
        sub.unsubscribe();
        resolve(info);
      });
    });
  }

  getItemName(id) { //Retreiving the Item Name (Static)
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

  getItemUnits(id) { //Retrieving the Item Units
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

  getItemCategory(id) { //Retrieving the Item Category
    let itemCategory: string;
    
    return new Promise((resolve, reject) => {
      let sub = this.fdb.list('items').snapshotChanges().subscribe(item => {
        console.log("get item cat sub")
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

  editItem(itemid, locationid, newValue) { //Editing Item Count ONLY
    console.log("edit item");
    this.fdb.object(`items/${itemid}/${locationid}`).update({count: newValue});
    this.logUpdateTime(locationid);
  }

  editSpecificItemDetails(count, thresh, ignore, itemid, locationid) { //Editing Item Count, Thresh and Ignore Status (From DetailedItemEdit Modal)
    console.log(`Path: ${itemid}/${locationid}`);
    console.log(`${count}, ${thresh}, ${ignore}`);

    this.fdb.object(`items/${itemid}/${locationid}`).update({count: count, threshhold: thresh, ignore: ignore});

    this.logUpdateTime(locationid)
  }

  editItemInfo(itemid, name, category, units) { //Edit entire item info (Units, Category, Name)
    let ref = this.fdb.object(`items/${itemid}`);
    let updateObj = {
      name: name,
      category: category,
      units: units
    };
    ref.update(updateObj);
  }

  


  /*

      START LOCATION FUNCTIONS BELOW

  */



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
        ref.update(
          { 
          id: ref.key,
          }
        )

        this.logUpdateTime(ref.key);

        let sub = this.fdb.list(`items`).snapshotChanges().subscribe(item => {
          console.log('add loc sub')
          item.forEach(item => {
            let itemInfo:any = item.payload.val();
            //console.log(itemInfo);
            this.fdb.object(`items/${itemInfo.id}/${ref.key}`).set({
              locationName: `${locationName}`,
              count: 0,
              threshhold: 0,
              ignore: false
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

  logUpdateTime(locationID) {
    let time = new Date();
    this.fdb.object(`locations/${locationID}`).update({
      lastUpdated: time
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

  editLocation(id, name, type) {

    this.fdb.object(`locations/${id}/`).update({name: name, type: type});

    let sub = this.fdb.list(`items`).snapshotChanges().subscribe(item => { //Update location details for the matching location ID in each item.
      console.log("edit loc sub")
      item.forEach(location => {
        let itemInfo:any = location.payload.val();
        let keys = Object.keys(itemInfo);
        keys.forEach(locid => {
          if( id == locid ) {
            //console.log(itemInfo[id]);
            this.fdb.object(`items/${location.payload.key}/${id}`).update({locationName: name, type: type});
          }
        })
      })
    sub.unsubscribe();
    })

    this.logUpdateTime(id);
  }



}//end class
