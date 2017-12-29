import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// Routing
import {PeopleRoutingModule} from './people-routing.module';
// pipes
import {LimitToPipe} from 'app/pipes/limit-to.pipe';
import {TrimPipe} from 'app/pipes/trim.pipe';
// Components
import {PeopleComponent} from './people.component';
import {PeopleFormComponent} from './people-form/people-form.component';
import {PeopleListComponent} from './people-list/people-list.component';

@NgModule({
  imports: [
    CommonModule,
    PeopleRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LimitToPipe,
    TrimPipe,
    PeopleComponent,
    PeopleFormComponent,
    PeopleListComponent
  ],
})
export class PeopleModule {
}
