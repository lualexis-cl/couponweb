import { AuthService } from './../_services/auth/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private route: Router) {
  }

  canActivate() {
    if (!this.authService.isLoggedIn()) {
      this.route.navigate(['/login']);
      return false;
    }

    return true;
  }
}
