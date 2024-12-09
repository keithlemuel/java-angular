import { Component, ViewChild, AfterViewInit, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
import { MatMenuModule } from '@angular/material/menu';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('drawer') sidenav!: MatSidenav;
  @ViewChild('appToolbar', { static: false }) toolbar!: ElementRef;
  @ViewChild('sidenavContainer') sidenavContainer!: ElementRef;
  title = 'Veterinary Management System';
  isVet: boolean = false;
  private userSubscription: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.isVet = user?.roles?.includes('ROLE_VET') ?? false;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.sidenav) {
        this.checkAuthAndUpdateSidenav();
      }
    });
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.sidenav) {
        this.checkAuthAndUpdateSidenav();
      }
    });
  }

  ngAfterViewInit() {
    // Remove the initialization from here
    // The router subscription will handle it
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private checkAuthAndUpdateSidenav() {
    if (this.sidenav) {
      if (this.authService.isLoggedIn() && !this.router.url.includes('/login')) {
        setTimeout(() => {
          this.sidenav.open();
        });
      } else {
        this.sidenav.close();
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleDrawer() {
    this.sidenav.toggle();
  }
}
