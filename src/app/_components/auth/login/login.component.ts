import { Subscription } from 'rxjs';
import { DialogService } from './../../../_services/dialogs/dialog.service';
import { GenericService } from './../../../_services/users/generic-service';
import { AuthService } from './../../../_services/auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'firebase';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { UserApplication } from 'src/app/_models/user-application';
import { UserTypeEnum } from './../../../_enums/user-type-enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;
  error: string = null;
  submittedForm: boolean;
  faSignInAlt = faSignInAlt;
  dbPathUserApplication: string;
  subscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private userApplicationService: GenericService<UserApplication>,
              private dialog: DialogService) {
    this.dbPathUserApplication = '/userApplication';
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get f(){
    return this.form.controls;
  }

  loginUser() {
    this.error = null;
    this.submittedForm = true;

    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.dialog.showLoading('', 'Autenticando...');

      this.authService.logInEmailUser(email, password)
        .then((response: User) => {
          this.validateCredentials(response, email);
        }).catch(err => {
          this.dialog.closeLoading();
          this.error = 'Error: Acceso restringido a usuarios registrados';
      });
    }
  }

  validateCredentials(userLogin: User, email: string) {
    this.subscription = this.userApplicationService.getList(this.dbPathUserApplication)
      .subscribe(users => {
        let accessDenied = true;

        users.forEach(user => {
          if (user.email === email &&
              user.userType === UserTypeEnum.Admin) {
            accessDenied = false;
          }
        });

        this.dialog.closeLoading();
        this.subscription.unsubscribe();

        if (accessDenied) {
          this.error = 'Error: Acceso restringido a usuarios registrados';
        } else {
          this.authService.setUser(userLogin);
          this.router.navigate(['/couponList']);
        }
      });
  }
}
