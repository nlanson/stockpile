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
    let i = 0;
    let itemData = {};
    this.fdb.list(`items/${id}`).snapshotChanges().forEach(item => {
      item.forEach(item => {
        let key = item.payload.key;
        let value = item.payload.val();
        if (key == "id" || key == "name") {
          
        } else {
          itemData[key] = value;
        }
        i++;
      })
    });
    
    return itemData
    //return this.fdb.list(`items/${id}`).valueChanges();
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
          location.forEach(location => {
            let locationName =  location.payload.val();
            ref.update({[locationName.name]: 0 })
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
