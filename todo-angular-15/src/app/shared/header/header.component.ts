import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/features/auth/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  readonly authenticationService = inject(AuthenticationService);

  isLogin = false;

  ngOnInit(): void {
    this.authenticationService.isLogin$.subscribe((value) => {
      this.isLogin = value;
    });
  }

  logOut() {
    this.authenticationService.logOut();
  }
}
