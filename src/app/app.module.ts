import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// routing
import {AppRoutingModule} from './app-routing.module';
// vendor
import {CookieModule} from 'ngx-cookie';
import {JwtHelper} from 'angular2-jwt';
import {MdDialogModule} from '@angular/material';
import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
// service
import {AuthService} from './services/auth.service';
import {CompaniesService} from './services/companies.service';
import {CSVService} from './services/csv.service';
import {HttpService} from './services/http.service';
import {ReportingService} from './services/reporting.service';
import {UserService} from './services/user.service';
import {CountriesService} from './services/countries.service';
import {LanguagesService} from './services/languages.service';
import {LocaleService} from './services/locale.service';
// guard
import {AuthGuard} from './guards/auth.guard';
// components
import {AppComponent} from './app.component';
import {AccessComponent} from './components/common/access/access.component';
import {CompaniesComponent} from './components/companies/companies.component';
import {HeaderComponent} from 'app/components/common/header/header.component';
import {CompanyFormComponent} from './components/companies/company-form/company-form.component';
import {EditPasswordComponent} from './components/profile/edit-password/edit-password.component';
import {CompanyDeleteComponent} from './components/companies/company-delete/company-delete.component';
import {PeopleDeleteComponent} from './components/people/people-delete/people-delete.component';
import {SendEmailComponent} from './components/common/send-email/send-email.component';

@NgModule({
  declarations: [
    AppComponent,
    AccessComponent,
    CompaniesComponent,
    HeaderComponent,
    CompanyFormComponent,
    EditPasswordComponent,
    CompanyDeleteComponent,
    PeopleDeleteComponent,
    SendEmailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MdDialogModule,
    CookieModule.forRoot(),
    ToastModule.forRoot()
  ],
  providers: [
    JwtHelper,
    AuthGuard,
    AuthService,
    CompaniesService,
    CSVService,
    HttpService,
    ReportingService,
    UserService,
    CountriesService,
    LanguagesService,
    LocaleService,
    ToastOptions
  ],
  entryComponents: [
    CompanyFormComponent,
    EditPasswordComponent,
    CompanyDeleteComponent,
    PeopleDeleteComponent,
    SendEmailComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
}
