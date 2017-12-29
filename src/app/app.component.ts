import {Component, OnInit} from '@angular/core';
// service
import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';
import {LocaleService} from 'app/services/locale.service';

@Component({
  selector: 'mpw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  private user;
  private currentLanguage: string;

  constructor(private authService: AuthService,
              private userService: UserService,
              private localeService: LocaleService) {
    this.currentLanguage = 'fr';
    this.checkBrowserLanguage();
    this.getFileLanguage();
  }

  ngOnInit() {
    console.log('%cVersion: 0.0.2', 'color: #1e9efb;');
  }

  get isActive() {
    this.user = this.userService.getLoggedUserData();
    if (this.user && this.authService.getAuthTokenFromStorage()) {
      return true;
    }
  }

  checkBrowserLanguage() {
    if (navigator.language && navigator.language !== '') {
      if (navigator.language === 'fr-FR' || navigator.language === 'fr') {
        this.currentLanguage = 'fr';
      } else {
        this.currentLanguage = 'en';
      }
    }
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

}
