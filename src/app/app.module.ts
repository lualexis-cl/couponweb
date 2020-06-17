import { RegistrationComponent } from './_components/auth/registration/registration.component';
import { LoginComponent } from './_components/auth/login/login.component';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import {
  AngularFireStorageModule
} from '@angular/fire/storage';

import { NavComponent } from './_components/nav/nav.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { CouponListComponent } from './_components/coupons/coupon-list/coupon-list.component';
import { StoreComponent } from './_components/coupons/store/store.component';
import { CreateCouponComponent } from './_components/coupons/create-coupon/create-coupon.component';
import { EditCouponComponent } from './_components/coupons/edit-coupon/edit-coupon.component';
import { UserListComponent } from './_components/users/user-list/user-list.component';
import { CreateUserComponent } from './_components/users/create-user/create-user.component';
import { EditPerfilComponent } from './_components/auth/edit-perfil/edit-perfil.component';
import { ClientCouponListComponent } from './_components/coupons/client-coupon-list/client-coupon-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    NavComponent,
    CouponListComponent,
    StoreComponent,
    CreateCouponComponent,
    EditCouponComponent,
    UserListComponent,
    CreateUserComponent,
    EditPerfilComponent,
    ClientCouponListComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    NgbModule,
    NgxPaginationModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [
    AngularFireAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
