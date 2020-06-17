import { UserListComponent } from './_components/users/user-list/user-list.component';
import { EditCouponComponent } from './_components/coupons/edit-coupon/edit-coupon.component';
import { CreateCouponComponent } from './_components/coupons/create-coupon/create-coupon.component';
import { CouponListComponent } from './_components/coupons/coupon-list/coupon-list.component';
import { LoginComponent } from './_components/auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { ClientCouponListComponent } from './_components/coupons/client-coupon-list/client-coupon-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'couponList' , component: CouponListComponent },
      { path: 'createCoupon' , component: CreateCouponComponent },
      { path: 'editCoupon/:id' , component: EditCouponComponent },
      { path: 'userList' , component: UserListComponent },
      { path: 'clientCouponList/:id', component: ClientCouponListComponent },
      { path: '', component: CouponListComponent }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
