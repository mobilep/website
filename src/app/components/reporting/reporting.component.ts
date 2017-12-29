import {Component, OnInit, OnDestroy, ViewContainerRef} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
// ToastsManager
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
// service
import {CompaniesService} from 'app/services/companies.service';
import {LocaleService} from 'app/services/locale.service';
import {CSVService} from 'app/services/csv.service';
// models
import {COMPANY} from 'app/models/company';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'mpw-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.sass']
})
export class ReportingComponent implements OnInit, OnDestroy {
  public local: any;
  private subscribeUrl: any;
  private company: COMPANY;
  public loaded: boolean;

  constructor(private localeService: LocaleService,
              private csvService: CSVService,
              private companiesService: CompaniesService,
              private router: Router,
              public toasts: ToastsManager,
              vcr: ViewContainerRef) {
    this.toasts.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.getLanguage();
    this.getCurrentCountry();
    this.subscribeUrlMethod();
  }

  ngOnDestroy() {
    this.subscribeUrl.unsubscribe();
  }

  getLanguage() {
    this.localeService.getLanguagesStore().then((res) => {
      this.local = res;
    });
  }

  exportCsvFile() {
    this.loaded = true;
    this.download();
    //   this.loaded = false;
    //   console.error(error);
    //   if(JSON.parse(error._body).message === 'ERROR_NO_PRACTICES_FOR_EXPORT')
    //     this.showToasts(this.local['ERROR_NO_PRACTICES_FOR_EXPORT'], 'error');
    //   else
    //     this.showToasts('Error export file', 'error');
    // });
  this.loaded = false;
  }
  getCurrentCountry() {
    this.companiesService.getSelectedCompanyStore().then((res) => {
      this.company = res;
    });
  }

  subscribeUrlMethod() {
    this.subscribeUrl = this.router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe(() => {
      this.getCurrentCountry();
    });
  }

  showToasts(text, type?) {
    if (type && type === 'error') {
      this.toasts.custom(`<span>${text}</span>`, null, {enableHTML: true});
    } else {
      this.toasts.custom(`<i class="icon-check"></i><span>${text}</span>`, null, {enableHTML: true});
    }
  }
  download(){
    const link = document.createElement("a");
    link.download = "practices_report";
    link.href  = this.csvService.exportReportingLink(this.company._id);
    document.body.appendChild(link);
    link.click();
  }

}
