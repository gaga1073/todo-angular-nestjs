import {
  AUTHENTICATION_URLs,
  GROUP_URLS,
  HOME_PATHS,
  USER_URLS,
} from '@/core/constants/path.constant';
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

  userImageUrl = null;

  ngOnInit(): void {
    this.authenticationService.isLogin$.subscribe((value) => {
      this.isLogin = value;
    });
  }

  onClickHome() {
    this.router.navigateByUrl(HOME_PATHS.base);
  }

  onClickUser() {
    this.router.navigateByUrl(USER_URLS.list);
  }

  onClickGroup() {
    this.router.navigateByUrl(GROUP_URLS.list);
  }

  logOut() {
    this.authenticationService.logOut().subscribe({
      next: () => {
        this.router.navigateByUrl(AUTHENTICATION_URLs.login);
      },
      error: () => {
        // Handle error if needed
      },
    });
  }
}
