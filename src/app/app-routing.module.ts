import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {AccessComponent} from './components/common/access/access.component';
import {CompaniesComponent} from './components/companies/companies.component';
import {CompanyFormComponent} from 'app/components/companies/company-form/company-form.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: '', component: AccessComponent, pathMatch: 'full', canActivate: [AuthGuard]},
      {path: 'auth', loadChildren: 'app/components/auth/auth.module#AuthModule'},
      {path: 'companies', component: CompaniesComponent, canActivate: [AuthGuard]},
      {path: 'company/add', component: CompanyFormComponent, canActivate: [AuthGuard]},
      {path: 'company/:id/edit', component: CompanyFormComponent, canActivate: [AuthGuard]},
      {path: 'company/:id/people', loadChildren: 'app/components/people/people.module#PeopleModule', canActivate: [AuthGuard]},
      {
        path: 'company/:id/reporting',
        loadChildren: 'app/components/reporting/reporting.module#ReportingModule',
        canActivate: [AuthGuard]
      },
      {path: '**', redirectTo: ''}
    ], {useHash: true})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}


