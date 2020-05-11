import { DialogService } from './../../../_services/dialogs/dialog.service';
import { ComboValidator } from './../../../validators/combo-validator';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserType } from './../../../_models/user_type';
import { GenericService } from './../../../_services/users/generic-service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserApplication } from 'src/app/_models/user-application';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, OnDestroy {

  userTypes: UserType[];
  form: FormGroup;
  submittedForm: boolean;
  subscription: Subscription;
  subscriptionValidator: Subscription;
  faWindowClose = faWindowClose;

  private dbPathUserType = '/userTypes';
  private dbPathUserApplication = '/userApplication';

  constructor(public activeModal: NgbActiveModal,
              private userTypeService: GenericService<UserType>,
              private userApplicationService: GenericService<UserApplication>,
              private dialog: DialogService) {
  }

  ngOnInit(): void {
    this.subscription = this.userTypeService.getList(this.dbPathUserType)
      .subscribe(users => {
        this.userTypes = users;
      });

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      userType: new FormControl('0', Validators.compose([Validators.required, ComboValidator.requiredSelected]))
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionValidator.unsubscribe();
  }

  get f(){
    return this.form.controls;
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

  saveUser() {
    this.submittedForm = true;

    if (this.form.valid) {
      const user = this.form.value as UserApplication;
      this.dialog.showLoading('', 'Guardando información...');

      this.subscriptionValidator = this.userApplicationService.getList(this.dbPathUserApplication)
        .subscribe(users => {
          let exists = false;
          users.forEach(userApplication => {
            if (userApplication.email === user.email) {
              exists = true;
            }
          });

          if (exists) {
            this.dialog.closeLoading();
            this.dialog.showMessageError('Error', 'Email registrado existe realmente, por lo tanto no se puede volver agregar');
            this.subscriptionValidator.unsubscribe();
            return;
          }

          this.confirmSaveUser();
        });
    }
  }

  confirmSaveUser() {
    const user = this.form.value as UserApplication;
    this.subscriptionValidator.unsubscribe();

    this.userApplicationService.create(this.dbPathUserApplication, user)
        .then(result => {
          this.dialog.closeLoading();
          this.submittedForm = false;
          this.form.reset();
          this.dialog.showSuccessMessage('', 'Usuario guardado de forma exitosa');
        }).catch(err => {
          this.dialog.closeLoading();
          this.dialog.showMessageError('Error', `Se produjo un error inesperado ${err.message}`);
        });
  }
}
