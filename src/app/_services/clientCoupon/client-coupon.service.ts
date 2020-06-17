import { StatusClientCoupon } from './../../_enums/status-client-coupon';
import { DialogService } from './../dialogs/dialog.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Coupon } from 'src/app/_models/coupon';
import { map } from 'rxjs/operators';
import { CouponInfo } from 'src/app/_models/coupon-info';
import { Observable } from 'rxjs';
import { ClientCouponInfo } from 'src/app/_models/client-coupon-info';

@Injectable({
  providedIn: 'root'
})
export class ClientCouponService {

  private dbPath: string;
  private itemRef: AngularFireList<Coupon>;

  constructor(private db: AngularFireDatabase,
              private dialog: DialogService) {
    this.dbPath = '/clientCoupon';
    this.itemRef = db.list(this.dbPath);
  }

  update(key: string, clientCoupon: any) {
    this.itemRef.set(key, clientCoupon);
  }

  remove(key: string) {
    this.itemRef.remove(key);
  }

  getClientCouponList(keyCoupon: string): Observable<string[]> {
    this.dialog.showLoading('', 'Procesando...');

    return this.itemRef.snapshotChanges()
      .pipe(map(result => {
        return result.map(elements => {
          let keyClient: string = null;
          if (elements.payload.child(keyCoupon).exists()) {
            const clientCoupon = elements.payload.child(keyCoupon).toJSON() as ClientCouponInfo;

            if (clientCoupon.status !== StatusClientCoupon.Deleted.valueOf()) {
              keyClient = elements.key;
            }
          }
          return keyClient;
        });
      }));
  }
}
