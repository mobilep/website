import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// component
import {ReportingComponent} from './reporting.component';
// routing
import {ReportingRoutingModule} from './reporting-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReportingRoutingModule
  ],
  declarations: [ReportingComponent]
})
export class ReportingModule {
}
