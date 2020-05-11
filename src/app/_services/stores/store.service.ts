import { map } from 'rxjs/operators';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Store } from 'src/app/_models/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private dbPath: string;
  private itemRef: AngularFireList<Store>;
  private tokenStore: string;

  constructor(db: AngularFireDatabase) {
    this.dbPath = '/Store';
    this.tokenStore = '1PFFrogCyJaQIFf2ebUiZzM1e0n1';
    this.itemRef = db.list(this.dbPath);
   }

   update(store: Store) {
     this.itemRef.set(this.tokenStore, store);
   }

   getStoreList(): Observable<Store[]> {
     return this.itemRef.snapshotChanges()
      .pipe(map(result => {
        return result.map(element => {
          const store = element.payload.toJSON() as Store;

          return store;
        });
      }))
   }
}
