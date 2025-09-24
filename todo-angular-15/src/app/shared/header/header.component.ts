import { AuthenticationService } from '@/features/auth/services/authentication.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  readonly authenticationService = inject(AuthenticationService);

  private readonly router = inject(Router);

  isLogin = false;

  ngOnInit(): void {
    this.authenticationService.isLogin$.subscribe((value) => {
      this.isLogin = value;
    });
  }

  logOut() {
    this.authenticationService.logOut().subscribe();
  }
}
