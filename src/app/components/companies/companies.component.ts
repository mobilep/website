import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
// service
import {CompaniesService} from 'app/services/companies.service';
import {LocaleService} from 'app/services/locale.service';
// models
import {COMPANY} from 'app/models/company';
// rxJs
import 'rxjs/add/operator/filter';

@Component({
  selector: 'mpw-company',
  styleUrls: ['./companies.component.sass'],
  templateUrl: './companies.component.html'
})

export class CompaniesComponent implements OnInit, OnDestroy {
  public companies: COMPANY[];
  public company: COMPANY;
  private subscribeUrl: any;
  public local;

  constructor(private companiesService: CompaniesService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private localeService: LocaleService) {
  }

  ngOnInit() {
    this.getAllCompanies();
    this.getCurrentCompany();
    this.getLanguage();
    this.subscribeUrlFn();
  }

  ngOnDestroy() {
    this.subscribeUrl.unsubscribe();
  }

  subscribeUrlFn() {
    this.subscribeUrl = this.activatedRoute.queryParams.subscribe(() => {
      this.getCurrentCompany();
    });
  }

  getLanguage() {
    this.localeService.getLanguagesStore().then((res) => {
      this.local = res;
    });
  }

  addCompany() {
    this.router.navigate([`company/add`]);
  }

  getCurrentCompany() {
    this.companiesService.getSelectedCompanyStore().then((res) => {
      this.company = res;
      if (res && res._id) {
        return this.router.navigate([`/company/${ res._id }/people/list`]);
      }
    });
  }

  getAllCompanies() {
    this.companiesService.getCompaniesStore().then((res) => {
      this.companies = res;
    });
  }



}
