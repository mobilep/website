import {Component, OnInit} from '@angular/core';
// vendor
import {MdDialog} from '@angular/material';
// service
import {AuthService} from 'app/services/auth.service';
import {LocaleService} from 'app/services/locale.service';

@Component({
  selector: 'mpw-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.sass']
})
export class EditPasswordComponent implements OnInit {
  public passwordType: string;
  public labelPassword: string;
  public disabledForm: boolean;
  public validationError: string;
  public local;

  constructor(private authService: AuthService,
              public dialog: MdDialog,
              private localeService: LocaleService) {
  }

  ngOnInit() {
    this.passwordType = 'password';
    this.disabledForm = true;
    this.getLanguage();
  }

  getLanguage() {
    this.localeService.getLanguagesStore().then((res) => {
      this.local = res;
      this.labelPassword = this.local['show'];
    });
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

  onSubmit(userPassword) {
    if (userPassword['valid']) {
      this.authService.changePassword(userPassword['value']).subscribe(
        () => {
          this.closeDialog();
          localStorage.setItem('notificationMessage', this.local.passwordUpdated);
        },
        (error) => {
          this.validationError = JSON.parse(error._body).message;
        }
      );
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }

}



