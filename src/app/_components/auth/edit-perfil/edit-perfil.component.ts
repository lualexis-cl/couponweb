import { User } from 'firebase';
import { DialogService } from './../../../_services/dialogs/dialog.service';
import { AuthService } from './../../../_services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-perfil',
  templateUrl: './edit-perfil.component.html',
  styleUrls: ['./edit-perfil.component.scss']
})
export class EditPerfilComponent implements OnInit {

  faWindowClose = faWindowClose;
  form: FormGroup;
  submittedForm: boolean;

  constructor(public activeModal: NgbActiveModal,
              private authService: AuthService,
              private dialog: DialogService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      rePassword: new FormControl('', [Validators.required, this.matchPassword])
    });
  }

  get f(){
    return this.form.controls;
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

  matchPassword(control: FormControl) {
    const dataForm = control.parent;

    if (!dataForm){
      return null;
    }

    const newPassword = dataForm.get('newPassword').value as string;
    const rePassword = dataForm.get('rePassword').value as string;

    if (newPassword !== rePassword) {
      return { matchPassword: true };
    }

    return null;
  }

  saveEditPerfil() {
    this.submittedForm = true;

    if (this.form.valid) {
      this.dialog.showLoading('', 'Procesando Información...');

      const user = this.authService.getUser() as User;
      const { oldPassword, newPassword, rePassword } = this.form.value;

      this.authService.logInEmailUser(user.email, oldPassword )
        .then((userLogin: User) => {
          userLogin.updatePassword(newPassword)
            .then(result => {
              this.dialog.closeLoading();
              this.submittedForm = false;
              this.form.reset();
              this.closeModal();

              this.dialog.showSuccessMessage('Confirmación', 'Password actualizado correctamente');
            }).catch(err => {
              this.dialog.closeLoading();
              this.dialog.showMessageError('Error', 'Se produjo un error al actualizar la password');
            });
        }).catch(err => {
          this.dialog.closeLoading();
          this.dialog.showMessageError('Error', 'Error contraseña actual no corresponde al usuario');
        });
    }
  }
}
