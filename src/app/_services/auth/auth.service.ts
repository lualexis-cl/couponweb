import { Coupon } from './../../_models/coupon';
import { UserProfile } from './../../_models/user-profile';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private dbPath: string;
  private itemRef: AngularFireList<UserProfile>;

  constructor(private auth: AngularFireAuth,
              private db: AngularFireDatabase) {
    this.dbPath = '/users';
    this.itemRef = db.list(this.dbPath);
    this.validateUser();
  }

  setUser(user?: firebase.User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  removeUser() {
    localStorage.removeItem('user');
  }

  private validateUser() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.setUser(user);
      } else {
        this.setUser(null);
      }
    });
  }

  logInEmailUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password)
        .then(userData => resolve(userData.user),
          err => reject(err));
    });
  }

  isLoggedIn() {
    const user = this.getUser() as Coupon;
    return user !== null;
  }

  logoutUser() {
    this.auth.signOut();
    this.removeUser();
  }

  getClientList(): Observable<UserProfile[]> {
    return this.itemRef.snapshotChanges()
    .pipe(map(result => {
      return result.map(element => {
        return element.payload.toJSON() as UserProfile;
      });
    }));
  }
}
