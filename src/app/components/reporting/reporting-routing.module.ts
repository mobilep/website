import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
// component
import {ReportingComponent} from './reporting.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ReportingComponent,
        children: []
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ReportingRoutingModule {
}
