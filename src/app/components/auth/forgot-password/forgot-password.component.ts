import {Component, OnInit} from '@angular/core';
// service
import {AuthService} from 'app/services/auth.service';
import {LocaleService} from 'app/services/locale.service';

@Component({
  selector: 'mpw-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass']
})

export class ForgotPasswordComponent implements OnInit {
  public validationError: string;
  public local;

  constructor(private authService: AuthService,
              private localeService: LocaleService) {
  }

  ngOnInit() {
    this.authService.clearUser();
    this.getLanguage();
  }

  getLanguage() {
    this.localeService.getLanguagesStore().then((res) => {
      this.local = res;
    });
  }

  onSubmit(forgotPassForm) {
    if (forgotPassForm.valid) {
      this.authService.sendResetEmail(forgotPassForm.value).subscribe(
        () => {
          localStorage.setItem('notificationMessage', this.local['pleaseCheckYourEmail']);
          this.authService.logOut();
        },
        error => {
          this.validationError = JSON.parse(error._body).message;
        }
      );
    }
  }


}
