import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';
import { ItemPage } from './pages/item/item.page';

import { AccountSettingsPage } from './pages/login/account-settings/account-settings.page';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';




var firebaseConfig = {
  apiKey: "AIzaSyDoPl0xyBWP11ekRSt5sZqdfqvj0u32o9c",
  authDomain: "stockpile-org.firebaseapp.com",
  databaseURL: "https://stockpile-org.firebaseio.com",
  projectId: "stockpile-org",
  storageBucket: "stockpile-org.appspot.com",
  messagingSenderId: "685941767979",
  appId: "1:685941767979:web:69b562e9087546a5508f6e"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatExpansionModule
  ],
  providers: [
    StatusBar,
    NativeStorage,
    FingerprintAIO,
    FirebaseService,
    SplashScreen,
    AuthService,
    ItemPage,
    AccountSettingsPage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
