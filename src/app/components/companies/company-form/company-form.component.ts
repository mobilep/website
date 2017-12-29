import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
// service
import {CompaniesService} from 'app/services/companies.service';
import {LocaleService} from 'app/services/locale.service';

@Component({
  selector: 'mpw-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.sass']
})

export class CompanyFormComponent implements OnInit {
  public company = {info: '', name: ''};
  public validationError: string;
  public companyId: any;
  public local;
  public companyForm: FormGroup;

  constructor(private router: Router,
              private location: Location,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private localeService: LocaleService,
              private companiesService: CompaniesService) {
  }

  ngOnInit(): void {
    this.buildFormModel();
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        this.companyId = params.id;
        this.getCompany();
      }
    });
    this.getLanguage();
  }

  getLanguage() {
    this.localeService.getLanguagesStore().then((res) => {
      this.local = res;
    });
  }

  buildFormModel() {
    this.companyForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
        Validators.pattern('[A-Za-zÀ-ž0-9_\\s&.-]{1,255}')
      ]),
      info: new FormControl('', [
        Validators.maxLength(4096)
      ]),
      // extraInformation: this.formBuilder.array([])
    });
  }

  initExtraInformation() {
    return this.formBuilder.group({
      title: [''],
      description: ['']
    });
  }

  addExtraInformation() {
    const control = <FormArray>this.companyForm.controls['extraInformation'];
    const addCtrl = this.initExtraInformation();
    control.push(addCtrl);
  }

  getCompany() {
    this.companiesService.getCompanyInfo(this.companyId).subscribe(
      (res) => {
        this.companiesService.selectCompanyInStore(res);
        this.company = res;
        this.validationError = '';

        this.companyForm.patchValue({
          name: res.name,
          info: res.info
        });

        // if (res.extraInformation && res.extraInformation.length) {
        //   for (let i = 0; i < res.extraInformation.length; i++) {
        //     this.addExtraInformation();
        //   }
        // } else {
        //   res.extraInformation = [];
        //   this.addExtraInformation();
        // }
        //
        // this.companyForm.patchValue({extraInformation: res.extraInformation});
      },
      (error) => {
        this.validationError = JSON.parse(error._body).message;
      }
    );
  }

  onSubmit({value, valid}) {
    if (valid) {
      if (this.companyId) {
        this.saveCompany(value);
      } else {
        this.addCompany(value);
      }
    }
  }

  saveCompany(body): void {
    this.companiesService.updateCompany(this.companyId, body).subscribe(
      (res) => {
        this.company = res;
        this.companiesService.updateCompanyInStore(res);
        this.companiesService.updateSelectedCompanyInStore(res);
        localStorage.setItem('notificationMessage', this.local['detailsUpdated']);
        this.location.back();
      },
      (error) => {
        this.validationError = JSON.parse(error._body).message;
      }
    );
  }

  addCompany(body): void {
    this.companiesService.addCompany(body).subscribe(
      (res) => {
        this.companiesService.addCompanyInStore(res);
        this.companiesService.selectCompanyInStore(res);
        localStorage.setItem('notificationMessage', this.local['companyCreated']);
        this.router.navigate([`/company/${res._id}/people/list`]);
      },
      (error) => {
        this.validationError = JSON.parse(error._body).message;
      }
    );
  }

  goBack() {
    this.location.back();
  }

}
