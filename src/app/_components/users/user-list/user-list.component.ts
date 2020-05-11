import { User } from 'firebase';
import { AuthService } from './../../../_services/auth/auth.service';
import { CreateUserComponent } from './../create-user/create-user.component';
import { DialogService } from './../../../_services/dialogs/dialog.service';
import { UserApplicationInfo } from './../../../_models/user-application-info';
import { Subscription } from 'rxjs';
import { GenericService } from './../../../_services/users/generic-service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserApplication } from 'src/app/_models/user-application';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faTrash, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  users: UserApplicationInfo[];
  collectionSize = 0;
  page = 1;
  dbPathUserApplication = '/userApplication';
  faTrash = faTrash;
  faUser = faUser;

  constructor(private genericService: GenericService<UserApplication>,
              private dialog: DialogService,
              private modalService: NgbModal,
              private userAuth: AuthService) {
  }

  ngOnInit(): void {
    this.dialog.showLoading('' , 'Obteniendo información...');
    this.subscription = this.genericService.getList(this.dbPathUserApplication)
      .subscribe(result => {
        this.users = result as UserApplicationInfo[];
        this.users = this.users.reverse();
        this.collectionSize = this.users.length;

        this.dialog.closeLoading();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  delete(key: string, email: string) {
    const user = this.userAuth.getUser() as User;
    if (email === user.email) {
      this.dialog.showMessageError('Error', 'No es posible borrar este registro ya que es su propio Usuario');
      return;
    }

    this.dialog.confirmMessage('Confirmación', '¿Está seguro que desea eliminar el usuario?',
    'No, Cancelar', 'Si, Eliminarlo')
      .then(confirm => {
        if (confirm.value) {
          this.dialog.showLoading('', 'Procesando...');
          this.confirmDelete(key);
        }else if (confirm.dismiss === Swal.DismissReason.cancel) {
        }
      });
  }

  confirmDelete(key: string) {
    this.genericService.delete(this.dbPathUserApplication, key)
      .then(result => {
        this.dialog.closeLoading();
        this.dialog.showSuccessMessage('', 'Usuario eliminado correctamente');
      }).catch(err => {
        this.dialog.closeLoading();
        this.dialog.showMessageError('Error', `Se produjo un error al eliminar ${err.message}`);
      });
  }

  openCreateUser() {
    const modalRef = this.modalService.open(CreateUserComponent);

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });
  }
}
