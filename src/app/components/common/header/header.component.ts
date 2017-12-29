import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
// vendor
import {MdDialog} from '@angular/material';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
// component
import {EditPasswordComponent} from 'app/components/profile/edit-password/edit-password.component';
import {CompanyDeleteComponent} from 'app/components/companies/company-delete/company-delete.component';
// service
import {AuthService} from 'app/services/auth.service';
import {UserService} from 'app/services/user.service';
import {LocaleService} from 'app/services/locale.service';
import {CompaniesService} from 'app/services/companies.service';
// models
import {COMPANY} from 'app/models/company';

@Component({
  selector: 'mpw-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public company: COMPANY;
  public companies: COMPANY[];

  public isAdmin: boolean;
  public currentLanguage: string;
  public loaded: boolean;
  private companyid: string;
  public userData: any;
  public local: any;
  public subscribeUrl: any;

  constructor(private authService: AuthService,
              private userService: UserService,
              private companiesService: CompaniesService,
              private localeService: LocaleService,
              public dialog: MdDialog,
              private router: Router,
              public toasts: ToastsManager,
              vcr: ViewContainerRef) {
    this.isAdmin = false;
    this.loaded = true;
    this.companiesService.getCompaniesStore().then((res) => {
      this.companies = res;
    });
    this.companiesService.getSelectedCompanyStore().then((res) => {
      this.company = res;
    });
    this.toasts.setRootViewContainerRef(vcr);
    this.subscribeDialog();
    this.currentLanguage = 'en';
  }

  ngOnInit() {
    this.getStorageUserData();
    this.getLanguage();

    this.subscribeUrl = this.router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe((e) => {

      if (e && e['url']) {
        if (e['url'].indexOf('company') > -1) {
          // this.getStorageUserData();
          const url = e['url'].split('/');
          if (url && url.length && url.length > 1) {
            this.companyid = url[2];
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscribeUrl.unsubscribe();
  }

  getLanguage() {
    this.localeService.getLanguagesStore().then((res) => {
      this.local = res;
    });
  }

  get isActive() {
    return this.userData;
  }

  getStorageUserData() {
    this.userService.getCurrentUser().subscribe(
      (res) => {
        this.userData = res;
        this.userService.setLoggedUserData(res);
        this.isAdminFn(res);
        setTimeout(this.onChangeCompany(res), 0);
        this.checkUserLanguage(res);
      },
      () => {
        this.authService.logOut();
      }
    );
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

  changeLanguage(lang) {
    this.currentLanguage = lang;
    this.getFileLanguage();
  }

  isAdminFn(user) {
    if (user['isSysAdmin']) {
      this.isAdmin = true;
    }
  }

  onChangeCompany(user) {
    if (this.isAdmin) {
      this.companiesService.getCompanies().subscribe(
        (res) => {
          this.companiesService.setCompaniesStore(res);
          this.loaded = false;
          this.companies = res;
          this.onSelectedCompany();
        },
        (error) => {
          console.error('Error: ', error);
        }
      );
    } else {
      this.companiesService.getCompanyInfo(user._company).subscribe(
        (res) => {
          this.companiesService.setCompanyToStore(res);
          this.companiesService.selectCompanyInStore(res);
          this.loaded = false;
          this.companies.push(res);
          this.company = res;
          this.router.navigate([`company/${res._id}/people/list`]);
        },
        (error) => {
          console.error('Error: ', error);
        }
      );
    }
  }

  onSelectedCompany() {
    if (this.companies.length) {
      if (this.companyid) {
        const selectCompany = this.companies.filter(item => item._id === this.companyid);
        this.companiesService.selectCompanyInStore(selectCompany[0]);
        this.router.navigate([`company/${this.companyid}/people/list`]);
      } else {
        this.companiesService.selectCompanyInStore(this.companies[0]);
        this.router.navigate([`company/${this.companies[0]._id}/people/list`]);
      }
    }
  }

  findSelectCompany(company) {
    this.companiesService.updateSelectedCompanyInStore(company);
    this.router.navigate([`company/${company._id}/people/list`]);
  }

  getWindowHeight(num) {
    if (window.outerHeight < num) {
      return '300px';
    } else {
      return 'initial';
    }
  }

  onDeleteCompany() {
    this.dialog.open(CompanyDeleteComponent, {
      width: '350px',
      data: this.company,
      height: this.getWindowHeight(550),
      position: {
        top: '20px'
      }
    });
  }

  editCompany() {
    this.router.navigate([`company/${this.company._id}/edit`]);
  }

  createCompany() {
    this.router.navigate([`company/add`]);
  }

  editPassword() {
    this.dialog.open(EditPasswordComponent, {
      width: '460px',
      height: this.getWindowHeight(550),
      position: {
        top: '20px'
      }
    });
  }

  onLogOut() {
    this.authService.logOut();
  }

  subscribeDialog() {
    this.dialog.afterAllClosed.subscribe(() => {
      this.checkLocalStorage();
    });
  }

  checkLocalStorage() {
    if (localStorage.getItem('notificationMessage')) {
      const message = localStorage.getItem('notificationMessage');
      this.showToasts(message);
      localStorage.removeItem('notificationMessage');
    }

    if (localStorage.getItem('notificationHeaderMessage')) {
      const message = localStorage.getItem('notificationHeaderMessage');
      this.showToasts(message);
      localStorage.removeItem('notificationHeaderMessage');
    }

  }

  showToasts(text) {
    this.toasts.custom(`<i class="icon-check"></i><span>${text}</span>`,
      null, {
        positionClass: 'toast-top-center',
        enableHTML: true
      });
  }

  toggleTouchFn(event) {
    const dropDownList = event.target.closest('body').querySelectorAll('.select-style');
    const dropDownParent = event.target.closest('.select-style');

    if (dropDownParent.classList.contains('select-style_active')) {
      dropDownParent.classList.remove('select-style_active');
    } else {
      if (dropDownList.length) {
        for (let i = 0; i < dropDownList.length; i++) {
          dropDownList[i].classList.remove('select-style_active');
        }
      }
      dropDownParent.classList.add('select-style_active');
    }
  }

  toggleClickFn(event) {
    event.target.classList.add('select-style_active');
  }

  toggleLeaveFn(event) {
    event.target.classList.remove('select-style_active');
  }

}
