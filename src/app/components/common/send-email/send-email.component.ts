import {Component, Inject, OnInit} from '@angular/core';
// vendor
import {MD_DIALOG_DATA, MdDialog} from '@angular/material';
// service
import {CompaniesService} from 'app/services/companies.service';
import {LocaleService} from 'app/services/locale.service';
// models
import {COMPANY} from 'app/models/company';

@Component({
  selector: 'mpw-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.sass']
})
export class SendEmailComponent implements OnInit {
  private company: COMPANY;
  public validationError: string;
  public validationDone: string;
  public local;

  constructor(@Inject(MD_DIALOG_DATA) public usersSelected: any,
              private companiesService: CompaniesService,
              private localeService: LocaleService,
              public dialog: MdDialog) {
    this.companiesService.getSelectedCompanyStore().then((res) => {
      this.company = res;
    });
  }

  ngOnInit() {
    this.getLanguage();
  }

  getLanguage() {
    this.localeService.getLanguagesStore().then((res) => {
      this.local = res;
    });
  }

  onSendEmail() {
    this.companiesService.sendInviteEmailToUser(this.company._id, this.usersSelected).subscribe((res) => {
      this.validationError = '';
      if (this.usersSelected.length > 1) {
        localStorage.setItem('notificationMessage', this.local['emailsSending']);
      } else {
        localStorage.setItem('notificationMessage', this.local['emailSending']);
      }
      this.closeDialog();
    }, (error) => {
      this.validationError = JSON.parse(error._body).message;
    });
  }

  sendTestMail(form) {
    this.companiesService.sendTestEmail(this.company._id, form.value).subscribe((res) => {
      this.validationError = '';
      this.validationDone = this.local['emailSendingTest'];
    }, (error) => {
      this.validationError = this.local['invalidEmailAddress'];
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
