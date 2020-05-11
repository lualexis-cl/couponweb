import { CouponInfo } from './../../_models/coupon-info';
import { DialogService } from './../dialogs/dialog.service';
import { map, finalize } from 'rxjs/operators';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Coupon } from 'src/app/_models/coupon';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private dbPath: string;
  private itemRef: AngularFireList<Coupon>;

  constructor(private db: AngularFireDatabase,
              private dialog: DialogService) {
    this.dbPath = '/coupons';
    this.itemRef = db.list(this.dbPath);
   }

   create(coupon: Coupon) {
     return this.itemRef.push(coupon);
   }

   update(key: string, coupon: Coupon) {
     return this.itemRef.set(key, coupon);
   }

   delete(key: string) {
     return this.itemRef.remove(key);
   }

   getCouponList(): Observable<CouponInfo[]> {
     this.dialog.showLoading('', 'Cargando Información...');

     return this.itemRef.snapshotChanges()
      .pipe(map(result => {
        return result.map(elements => {
          this.dialog.closeLoading();
          const coupon = elements.payload.toJSON() as CouponInfo;
          coupon.key = elements.key;

          return coupon;
        });
      }));
   }

   getSingle(key: string) {
     return this.db.object(`${this.dbPath}/${key}`)
      .snapshotChanges()
      .pipe(map(result => {
        const coupon = result.payload.toJSON() as CouponInfo;
        coupon.key = result.key;

        return coupon;
      }));
   }
}
