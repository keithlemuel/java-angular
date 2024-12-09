import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.getToken()) {
      this.showError('Please log in to access this page');
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = route.data['role'];
    if (requiredRole) {
      const isVet = this.authService.isVet();
      if (requiredRole === 'ROLE_VET' && !isVet) {
        this.showError('You do not have permission to access this page');
        this.router.navigate(['/dashboard']);
        return false;
      }
    }

    return true;
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
} 