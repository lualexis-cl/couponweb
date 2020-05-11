import { EditPerfilComponent } from './../auth/edit-perfil/edit-perfil.component';
import { User } from 'firebase';
import { AuthService } from './../../_services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private authService: AuthService,
              private route: Router,
              private modal: NgbModal) { }

  ngOnInit(): void {
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logoutUser();
    this.route.navigate(['login']);
  }

  openEditPassword() {
    const modalRef = this.modal.open(EditPerfilComponent);

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });
  }
}
