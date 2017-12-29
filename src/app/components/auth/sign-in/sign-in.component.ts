import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
// service
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {AuthService} from 'app/services/auth.service';
import {UserService} from 'app/services/user.service';
import {LocaleService} from 'app/services/locale.service';

@Component({
  selector: 'mpw-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})

export class SignInComponent implements OnInit {
  public validationError: string;
  public passwordType: string;
  public labelPassword: string;
  public notificationMessage: string;
  public local;
  public currentLanguage: string;

  constructor(private authService: AuthService,
              private userService: UserService,
              private localeService: LocaleService,
              private router: Router,
              public toasts: ToastsManager,
              vcr: ViewContainerRef) {
    this.toasts.setRootViewContainerRef(vcr);
    this.getMessages();
  }

  ngOnInit() {
    this.passwordType = 'password';
    setTimeout(() => {
      this.notificationMessage = '';
      localStorage.removeItem('notificationMessage');
    }, 5000);

    this.authService.logOut();
    this.getLanguage();
  }

  getLanguage() {
    this.localeService.getLanguagesStore().then((res) => {
      this.local = res;
      this.labelPassword = this.local['show'];
    });
  }

  getMessages() {
    this.notificationMessage = localStorage.getItem('notificationMessage');
    if (this.notificationMessage) {
      this.show(this.notificationMessage);
    }
  }

  show(text) {
    this.toasts.custom(`<i class="icon-check"></i><span>${text}</span>`,
      null, {
        positionClass: 'toast-top-center',
        enableHTML: true
      });
  }

  checkUserLanguage(user) {
    if (user.lang && user.lang !== '') {
      if (user.lang === 'french') {
        this.currentLanguage = 'fr';
      } else {
        this.currentLanguage = 'en';
      }
    }
    this.getFileLanguage();
  }

  getFileLanguage() {
    this.localeService.getLanguages(this.currentLanguage).subscribe(
      (data) => {
        this.localeService.setLanguagesStore(data);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit(loginForm) {
    if (loginForm.valid) {
      this.authService.signIn(loginForm.value).subscribe(
        data => {
          this.authService.setAuthTokenToStorage(data.accessToken);
          this.userService.setLoggedUserData(data);
          this.checkUserLanguage(data);
          this.router.navigate(['/companies']);
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
