import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
// vendor
import {MD_DIALOG_DATA, MdDialog} from '@angular/material';
// service
import {CompaniesService} from 'app/services/companies.service';
import {LocaleService} from 'app/services/locale.service';
// models
import {COMPANY} from 'app/models/company';

@Component({
  selector: 'mpw-company-delete',
  templateUrl: './company-delete.component.html',
  styleUrls: ['./company-delete.component.sass']
})
export class CompanyDeleteComponent implements OnInit {
  public companies: COMPANY[];
  public local;

  constructor(@Inject(MD_DIALOG_DATA) public company: any,
              private companiesService: CompaniesService,
              private localeService: LocaleService,
              public dialog: MdDialog,
              private router: Router) {
    this.companiesService.getCompaniesStore().then((res) => {
      this.companies = res;
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

  deleteCompany() {
    this.companiesService.removeCompany(this.company._id).subscribe(
      (res) => {
        this.closeDialog();
        this.companiesService.deleteCompanyFromStore(res);
        localStorage.setItem('notificationHeaderMessage', this.local['companyDelete']);
        if (this.companies.length) {
          this.companiesService.selectCompanyInStore(this.companies[0]);
          this.router.navigate([`/company/${this.companies[0]._id}/people/list`]);
        }
      },
      (error) => {
        console.error('Error: ', error);
      }
    );
  }

  closeDialog() {
    this.dialog.closeAll();
  }

}
