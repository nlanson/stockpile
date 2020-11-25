import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import{ Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs'; 
import { AlertController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<firebase.User>;
  savedUser: any;
  users: Array<any>;
  authState: boolean;
  currentUser: any;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private navroute: Router,
    public fdb: AngularFireDatabase,
    private ac: AlertController,
    private ns: NativeStorage
  ) { 
    this.users = this.getUsers();
    this.currentUser = null;
  }

  setAccount(email, password) {
    this.ns.setItem('account', {email: email, password: password})
    .then(
      () => console.log('Account stored for ' + email),
      error => console.error('Error storing item', error)
    );

    //localStorage.setItem('account', JSON.stringify({"email": email, "password": password}));
  }

  getSavedAccounts() {
    return new Promise((resolve, reject) => {
      this.ns.getItem('account')
      .then(data=>{
          this.savedUser = data;
          resolve(this.savedUser);
      })
      .catch(err=> {
        console.log(err);
        resolve(this.savedUser);
      });
      //this.savedUser = JSON.parse(localStorage.getItem('account'));
      //return this.savedUser;
    })

  }

  login(email: string, password: string) {
    this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Login Success');
        this.currentUser = value.user; //set the current user here
        this.navroute.navigate(['/tabs']);
        
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
        this.presentAlert(err.message);
      });
  }

  logout() {
    this.firebaseAuth
      .signOut();
      console.log("User has logged out");
      this.currentUser = null; //on logout, set the current user to null
    this.navroute.navigate(['/login']);
  }

  getUsers() {
    let users =  this.fdb.list('users').valueChanges();
    let usersArray = new Array();
    users.forEach((user) => {
      usersArray.push(user);
    });
    return usersArray;
  }

  get cUser() {
    return this.currentUser;
  }

  updateDisplayName() {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: "Frankton", //To set display name of new user.
    }).then(function() {
      console.log("success")
    }).catch(function(error) {
      console.log("failed")
    });
  }

  async presentAlert(error) {
    const alert = await this.ac.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: error,
      buttons: ['OK']
    });

    await alert.present();
  }


}
