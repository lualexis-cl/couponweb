import { DialogService } from './../../../_services/dialogs/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfile } from './../../../_models/user-profile';
import { Subscription } from 'rxjs';
import { AuthService } from './../../../_services/auth/auth.service';
import { ClientCouponService } from './../../../_services/clientCoupon/client-coupon.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { faBackward } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-client-coupon-list',
  templateUrl: './client-coupon-list.component.html',
  styleUrls: ['./client-coupon-list.component.scss']
})
export class ClientCouponListComponent implements OnInit, OnDestroy {

  private susbcription: Subscription;
  private clientSubscription: Subscription;
  userProfile: UserProfile[];
  collectionSize = 0;
  page = 1;
  faBackward = faBackward;

  constructor(private clientCouponService: ClientCouponService,
              private authService: AuthService,
              private route: Router,
              private dialog: DialogService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const keyCoupon = this.activatedRoute.snapshot.params['id'] as string;
    this.susbcription = this.clientCouponService.getClientCouponList(keyCoupon)// '-M909_caL1YzrNrwi1Md')
      .subscribe(data => {
        console.log(data);
        const keys = data.filter(key => key != null);
        console.log(keys);

        if (keys.length === 0) {
          this.dialog.closeLoading();
          return;
        }

        this.clientSubscription = this.authService.getClientList()
          .subscribe(clients => {
            this.userProfile = clients.filter(client => keys.includes(client.uid));
            this.collectionSize = this.userProfile.length;

            this.dialog.closeLoading();
          });
      });
  }

  ngOnDestroy() {
    if (this.susbcription) {
      this.susbcription.unsubscribe();
    }

    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }
  }

  back() {
    this.route.navigate(['/couponList']);
  }

}
