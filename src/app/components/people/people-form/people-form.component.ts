import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
// Service
import {CompaniesService} from 'app/services/companies.service';
import {CountriesService} from 'app/services/countries.service';
import {LanguagesService} from 'app/services/languages.service';
import {LocaleService} from 'app/services/locale.service';
import {UserService} from 'app/services/user.service';

@Component({
  selector: 'mpw-people-form',
  templateUrl: './people-form.component.html',
  styleUrls: ['./people-form.component.sass']
})
export class PeopleFormComponent implements OnInit, OnDestroy {
  public languages: any[];
  public countries: any[];
  public local;
  public user;
  private companyId: string;
  public uid: string;
  public passwordType: string;
  public labelPassword: string;
  public person: FormGroup;
  private subscribeUrl: any;
  public validationError: string;

  constructor(private languagesService: LanguagesService,
              private countriesService: CountriesService,
              private localeService: LocaleService,
              private userService: UserService,
              private companiesService: CompaniesService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder) {
    this.passwordType = 'password';
    this.subscribeUrlFn();
  }

  ngOnInit() {
    this.buildFormGroup();

    this.route.params.subscribe((params: Params) => {
      if (params['uid']) {
        this.uid = params['uid'];
        this.getUserInfo();
      } else {
        this.initExtraInformationAtCreate();
      }
    });
    this.getLanguage();
    this.getLanguages();
    this.getCountries();
  }

  getLanguage() {
    this.localeService.getLanguagesStore().then((res) => {
      this.local = res;
      this.labelPassword = this.local['show'];
    });
  }

  getLanguages() {
    this.countriesService.getCountries().then((res) => {
      this.countries = res;
    });
  }

  getCountries() {
    this.languagesService.getLanguages().then((res) => {
      this.languages = res
    });
  }

  ngOnDestroy(): void {
    this.subscribeUrl.unsubscribe();
  }

  subscribeUrlFn() {
    this.subscribeUrl = this.router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe(() => {
      this.getCompanyIdFromURL();
    });
  }

  buildFormGroup() {
    this.person = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern('[A-Za-zÀ-ž_\\s-.`\'&]{1,30}')
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern('[A-Za-zÀ-ž_\\s-.`\'&]{1,30}')
      ]),
      email: new FormControl('', [
        Validators.email,
        Validators.required,
        Validators.pattern('^[a-zA-ZÀ-ž0-9!#$%&\'*+\/=?^_`{|}~.-]+@[a-zA-ZÀ-ž0-9]([a-zA-ZÀ-ž0-9-]*[a-z0-9])?(\.[a-zA-ZÀ-ž0-9]' +
          '([a-zA-ZÀ-ž0-9-]*[a-zA-ZÀ-ž0-9])?)*')
      ]),
      country: new FormControl('', [
        Validators.required
      ]),
      postcode: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern('[A-Za-zÀ-ž0-9_\\s-.]{1,30}')
      ]),
      lang: new FormControl('fr', [
        Validators.required
      ]),
      isCompanyAdmin: new FormControl(false),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      extraInformation: this.formBuilder.array([])
    });
  }

  getCompanyIdFromURL() {
    this.companyId = this.route.snapshot.pathFromRoot[1].url[1].path;
  }

  initExtraInformation() {
    return this.formBuilder.group({
      title: [''],
      description: ['']
    });
  }

  initExtraInformationAtCreate() {
    const control = <FormArray>this.person.controls['extraInformation'];
    const initData = [{
      title: 'Business Unit',
        description: ''
    },
    {
      title: 'Region',
        description: ''
    },
    {
      title: 'Country Region',
        description: ''
    },
    {
      title: 'Global Region',
        description: ''
    },
    {
      title: 'Custom 1',
        description: ''
    },
    {
      title: 'Custom 2',
        description: ''
    },
    {
      title: 'Custom 3',
        description: ''
    }];
    initData.forEach(data => control.push(this.formBuilder.group(data)));
  }

  addExtraInformation() {
    const control = <FormArray>this.person.controls['extraInformation'];
    const addCtrl = this.initExtraInformation();
    control.push(addCtrl);
  }

  removeExtraInformation(i: number) {
    const control = <FormArray>this.person.controls['extraInformation'];
    control.removeAt(i);
  }

  getUserInfo() {
    this.userService.getUserInfo(this.companyId, this.uid).subscribe(
      (user) => {
        if (user) {
          this.user = user;

          this.person.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            postcode: user.postcode,
            country: user.country,
            lang: user.lang,
            isCompanyAdmin: user.isCompanyAdmin
          });

          if (user.extraInformation.length) {
            for (let i = 0; i < user.extraInformation.length; i++) {
              this.addExtraInformation();
            }
          } else {
            this.addExtraInformation();
          }

          this.person.patchValue({extraInformation: user.extraInformation});

        } else {
          this.goBack();
        }
      },
      () => {
        this.goBack();
      }
    );
  }

  onChangeIsCompanyAdmin(event) {
    if (event.target.checked === false) {
      this.person.patchValue({password: ''});
    }
  }

  onSubmit({value, valid}) {
    if (value.isCompanyAdmin === false) {
      delete value['password'];
    }

    if (value.isCompanyAdmin === true && value.password.trim() === '') {
      delete value['password'];
    }

    const myLocalArray = [];

    value.extraInformation.map((elem) => {
      if (elem.title.trim().length || elem.description.trim().length) {
        myLocalArray.push(elem);
      }
    });

    value.extraInformation = myLocalArray;

    if (valid) {
      if (this.uid) {
        this.edit(value);
      } else {
        this.add(value);
      }
    }
  }

  add(body) {
    this.companiesService.inviteUserToCompany(this.companyId, [body]).subscribe(
      () => {
        localStorage.setItem('notificationMessage', this.local['personAdded']);
        this.goBack();
      },
      (error) => {
        this.validationError = JSON.parse(error._body).message;
      }
    );
  }

  edit(body) {
    this.userService.editUser(this.companyId, this.uid, body).subscribe(
      () => {
        localStorage.setItem('notificationMessage', this.local['detailsUpdated']);
        this.goBack();
      },
      (error) => {
        console.dir(error);
        this.validationError = JSON.parse(error._body).message;
      }
    );
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

  goBack() {
    return this.router.navigate([`company/${this.companyId}/people/list`]);
  }

  trackByFn(index: any) {
    return index;
  }

}















