import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
// service
import {AuthService} from 'app/services/auth.service';
import {LocaleService} from 'app/services/locale.service';

@Component({
  selector: 'mpw-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})

export class ChangePasswordComponent implements OnInit, OnDestroy {
  public passwordType: string;
  public labelPassword: string;
  public validationError: string;
  public local;
  private sub: any;

  constructor(private authService: AuthService,
              private localeService: LocaleService,
              private route: ActivatedRoute) {
    this.passwordType = 'password';
  }

  ngOnInit() {
    this.authService.clearUser();
    this.getLanguage();
    this.sub = this.route.params.subscribe(params => {
      if (params && params.jwt) {
        this.authService.setAuthTokenToStorageReset(params.jwt);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getLanguage() {
    this.localeService.getLanguagesStore().then((res) => {
      this.local = res;
      this.labelPassword = this.local['show'];
    });
  }

  onSubmit(newPassForm) {
    if (newPassForm.valid) {
      this.authService.resetPass(newPassForm.value).subscribe(
        (res) => {
          localStorage.setItem('notificationMessage', this.local['passwordUpdated']);
          this.authService.logOut();
        },
        (error) => {
          this.validationError = JSON.parse(error._body).message;
        }
      );
    }
  }

  onPasswordType() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.labelPassword = this.local['hide'];
    } else {
      this.passwordType = 'password';
      this.labelPassword = this.local['show'];
    }
  }
}
