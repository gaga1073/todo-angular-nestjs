import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ENVIRONMENT } from './core/token/environment.token';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthenticationInterceptor } from './core/interceptors/authentication.interceptor';
import { environment } from '@/environments/environment';
import { AuthenticationService } from './features/auth/services/authentication.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forRoot(),
  ],
  providers: [
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthenticationService) => {
        return () => auth.initialize();
      },
      deps: [AuthenticationService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
