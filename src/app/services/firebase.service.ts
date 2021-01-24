import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
import { timer } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  threshDifferenceValue: number;

  constructor(
    public fdb: AngularFireDatabase,
  ) { 
    this.threshDifferenceValue = 3;
  }

  addItem(name: string, longName: any, units: string, category: string) { //Add a new Item
    name = name.charAt(0).toUpperCase() + name.slice(1); //Make the first letter of the new item capital letter.
    longName = longName.charAt(0).toUpperCase() + longName.slice(1);
    let item = { //Create new object item with the input parameters.
      name: name,
      longName: name,
      units: units,
      category: category
    }
    item.longName = (longName != null || undefined) ? longName : name; //Ternary Operator (Fireship NaN)
    console.log(item.longName);

    this.fdb.list(`items`).push(item).then((ref) => {
      this.fdb.object(`items/${ref.key}`) //Create new entry in the "items/" database with the randomly generated reference key.
      ref.update({ id: ref.key }) //set the new item ID to the randomlyt generated ref key.

      let sub = this.fdb.list(`locations`).snapshotChanges().subscribe(location => { //Subscribe to the "locations/" database 
        console.log('add item sub');
        location.forEach(location => {
          let locationInfo:any = location.payload.val(); //set the current iteration of location info to locationInfo variable.
          ref.update( //For each location in the locations/ database, push a new object with the location ID as key with location name, count, thresh and ignore values set to defaults.
            {
            [locationInfo.id]: { 
              locationName: `${locationInfo.name}`, //location name pulled from locations/ database.
              count: 0,
              threshhold: 0,
              ignore: false
            }
          })
        })
        sub.unsubscribe(); //Unsubscrieb to the "locations/" database.
      })
    })
  }

  removeItem(id) { //Delete an Item
    console.log(`removing ${id}`);
    this.fdb.object("items/" + id).remove().then((ref) => { //remove the item with the input parameter ID.
      console.log("success"); //If success, log 'success'.
      }, (error) => {
        console.error(error);
      })
  }
  
  getItems() { //Live Reload Information for ALL items
    return this.fdb.list('items').valueChanges();
  }
  
  getItemsBySearchTerm(searchTerm) { //Getting items via search term (Returns an array of items that match the search term.)
    searchTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1); //Make input parameter search term's first letter capitalised, since all item names start with a capital letter.
    let scope = searchTerm.length; //set the scope to the search term's length.
    return new Promise((resolve, reject) => {
      let ResultsArray = [];
      let sub;
      sub = this.fdb.list('items'/*, ref => ref.orderByChild('name').equalTo(searchTerm)*/).snapshotChanges().subscribe((res) => {
        res.forEach((rresult) => { //for each item in the "items/" database, look for any item names that have the same characters with the search term for the scope.
          let result: any = rresult.payload.val();
          if (result.longName) { //If longName property exists, search through those too!
            if( result.name.substr(0, scope) == searchTerm || result.longName.substr(0, scope) == searchTerm) { //Slice result.name to the scope length.
              ResultsArray.push(result) //If match, push to the result array
            }
          } else {
            if( result.name.substr(0, scope) == searchTerm ) { //Slice result.name to the scope length.
              ResultsArray.push(result) //If match, push to the result array
            }
          }
          
          
        });
        sub.unsubscribe();
      })
      resolve(ResultsArray) //Return ResultsArray to be displayed on screen.
    })
  }

  getItem(id) { // Live Reload Information for a  SINGLE item (ValueChanges => Stock Count)
    return this.fdb.object(`items/${id}`).valueChanges();
  }

  getItemMetaData(id) { //Static Data (Category, ID, Name and Units)
    return new Promise((resolve, reject) => {
      let sub = this.fdb.object(`items/${id}`).snapshotChanges().subscribe((res) => {
        let info = res.payload.val(); //set variable info to the value of item/id in the database. ID from param.
        sub.unsubscribe();
        resolve(info); //Return info.
      });
    });
  }

  editItem(itemid, locationid, newValue) { //Editing Item Count ONLY
    this.fdb.object(`items/${itemid}/${locationid}`).update({count: newValue}); //Push the new count, newValue, into the database object items/itemid/locationid from input param IDs.
    this.logUpdateTime(locationid); //Call function logUpdateTime to record the time of update.
  }

  editSpecificItemDetails(count, thresh, ignore, itemid, locationid) { //Editing Item Count, Thresh and Ignore Status (From DetailedItemEdit Modal)
    console.log(`Path: ${itemid}/${locationid}`);
    console.log(`${count}, ${thresh}, ${ignore}`);

    this.fdb.object(`items/${itemid}/${locationid}`).update({count: count, threshhold: thresh, ignore: ignore}); //updating the item details for a specific location by input param ID and info.
    
    this.logUpdateTime(locationid); //Call function logUpdateTime to record the time of update.
  }

  editItemInfo(itemid, name, longName, category, units) { //Edit entire item info (Units, Category, Name)
    let ref = this.fdb.object(`items/${itemid}`); //Sets database reference to input param IDs.
    
    let updateObj = { //Creates an object with the updated info from the input params.
      name: name,
      longName: longName,
      category: category,
      units: units
    };
    ref.update(updateObj); //pushes the updated Object to the database ref.
  }

  get getColorThreshDifferenceValue() {
    return this.threshDifferenceValue; //The thresh difference value is set to 3 in the constructor. This is used to determine the low stock warning colours.
  }

  


  /*

      START LOCATION FUNCTIONS BELOW

  */



  getLocations() {
    return this.fdb.list('locations').valueChanges(); //Return live reload observable for locations DB.
  }

  addLocation(locationName, locationType) {
    let location = { //create a new location object from input params.
      name: locationName,
      type: locationType
    }
    
    this.fdb.list('locations').push(location) //Push the location object into the locations database.
      .then((ref) => {
        //console.log(ref);
        this.fdb.object('locations/' + ref.key)
        ref.update(
          { 
          id: ref.key, //Set location ID to the randomly generated ref key.
          }
        )

        this.logUpdateTime(ref.key); //Call function logUpdateTime to record the time of update.

        let sub = this.fdb.list(`items`).snapshotChanges().subscribe(item => {
          console.log('add loc sub')
          item.forEach(item => { //Loop over each item in the items/ database and create an instance of the new location in each item.
            let itemInfo:any = item.payload.val(); //Set itemInfo variable to the current item from the items/ database
            //console.log(itemInfo);
            this.fdb.object(`items/${itemInfo.id}/${ref.key}`).set({ //create a new object in the item for the newly created location
              locationName: `${locationName}`, //set the value of the new location object in the individual item to the defaults.
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

  removeLocation(locationid) { //Delete a location.
    this.fdb.object(`locations/${locationid}`).remove().then(() => { //Delete the location, then...
      let sub = this.fdb.list(`items`).snapshotChanges().subscribe(item => {
        console.log('rem loc sub');
        item.forEach(item => { //Loop over each item, and delete each instance of the deleted location from the item.
          let itemInfo: any = item.payload.val();
          this.fdb.object(`items/${itemInfo.id}/${locationid}`).remove(); //Delete the loocation instance from the item.
        })
        sub.unsubscribe();
      })
    })
  }

  logUpdateTime(locationID) { //Logging update time
    let time = new Date(); //set variable time to be the current date time.
    this.fdb.object(`locations/${locationID}`).update({
      lastUpdated: time //push the current datetime into the used locations (from input param) database.
    })
  }

  getLocationMetaData(id) { //Pull the location item meta data from location ID param. (static)
    return new Promise((resolve, reject) => {
      let sub = this.fdb.object(`locations/${id}`).snapshotChanges().subscribe((res) => {
        let info = res.payload.val(); //let info equal the snapshot value of the called upon location
        sub.unsubscribe();
        resolve(info); //return the static location info
      });
    });
  }

  editLocation(id, name, type) { //Edit a location.

    this.fdb.object(`locations/${id}/`).update({name: name, type: type}); //Update the name and type of a location from input params.

    let sub = this.fdb.list(`items`).snapshotChanges().subscribe(item => { //Update location details for the matching location ID in each item.
      console.log("edit loc sub")
      item.forEach(location => { //For each item, if there is a location instance in the object with the same ID as the edited location, edit the instance details to match the edit.
        let itemInfo:any = location.payload.val();
        let keys = Object.keys(itemInfo);
        keys.forEach(locid => { //Iterate over locationID keys in the item object.
          if( id == locid ) { //If one of the keys equals the changed location ID, update the values.
            //console.log(itemInfo[id]);
            this.fdb.object(`items/${location.payload.key}/${id}`).update({locationName: name, type: type});
          }
        })
      })
    sub.unsubscribe();
    })

    this.logUpdateTime(id); //Call function logUpdateTime to record the time of update.
  }



}//end class
