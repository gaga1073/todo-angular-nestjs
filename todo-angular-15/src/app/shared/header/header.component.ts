import { USER_URLS } from '@/core/constants/path.constant';
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

  // userImageUrl = 'https://lecture.ecc.u-tokyo.ac.jp/JOHZU/joho/imageformat/images/image01.jpg';
  userImageUrl = null;

  ngOnInit(): void {
    this.authenticationService.isLogin$.subscribe((value) => {
      this.isLogin = value;
    });
  }

  onClickUser() {
    this.router.navigateByUrl(USER_URLS.list);
  }

  logOut() {
    this.authenticationService.logOut().subscribe();
  }
}
