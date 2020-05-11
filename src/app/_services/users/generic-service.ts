import { DialogService } from '../dialogs/dialog.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  constructor(private db: AngularFireDatabase) {
  }

   create(dbPath: string, userApplication: T) {
     return this.db.list(dbPath)
        .push(userApplication);
   }

   update(dbPath: string, key: string, userApplicacion: T) {
     return this.db.list(dbPath)
        .set(key, userApplicacion);
   }

   delete(dbPath: string, key: string) {
     return this.db.list(dbPath)
        .remove(key);
   }

   getList(dbPath: string) {// : Observable<string, T[]> {

    return this.db.list(dbPath).snapshotChanges()
     .pipe(map(result => {
       return result.map(elements => {
         const list = elements.payload.toJSON() as T;
         const key = elements.key;

         return { key, ...list } as T;
       });
     }));
  }

  getSingle(dbPath: string, key: string) {
    return this.db.object(`${dbPath}/${key}`)
     .snapshotChanges()
     .pipe(map(result => {
       const list = result.payload.toJSON() as T;
       // tslint:disable-next-line: no-shadowed-variable
       const key = result.key;

       return { key, ...list } as T;
     }));
  }
}
