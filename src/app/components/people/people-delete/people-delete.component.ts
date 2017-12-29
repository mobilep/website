import {Component, Inject, OnInit} from '@angular/core';
// vendor
import {MD_DIALOG_DATA, MdDialog} from '@angular/material';
// service
import {UserService} from 'app/services/user.service';
import {CompaniesService} from 'app/services/companies.service';
import {LocaleService} from 'app/services/locale.service';
// models
import {COMPANY} from 'app/models/company';

@Component({
  selector: 'mpw-people-delete',
  templateUrl: './people-delete.component.html',
  styleUrls: ['./people-delete.component.sass']
})
export class PeopleDeleteComponent implements OnInit {
  private company: COMPANY;
  public validationError: string;
  public onePerson: boolean;
  public local;

  constructor(@Inject(MD_DIALOG_DATA) public people: any,
              private userService: UserService,
              private localeService: LocaleService,
              private companiesService: CompaniesService,
              public dialog: MdDialog) {
    this.companiesService.getSelectedCompanyStore().then((res) => {
      this.company = res;
    });
  }

  ngOnInit() {
    this.countPeople();
    this.getLanguage();
  }

  getLanguage() {
    this.localeService.getLanguagesStore().then((res) => {
      this.local = res;
    });
  }

  countPeople() {
    if (this.people.length === 1) {
      this.onePerson = true;
    } else if (this.people.length > 1) {
      this.onePerson = false;
    }
  }

  onDelete() {
    if (this.onePerson) {
      this.deletePerson();
    } else {
      this.transformPeopleObjects();
      this.deletePeople();
    }
  }

  deletePerson() {
    this.userService.deleteUser(this.company._id, this.people[0]).subscribe(
      (res) => {
        this.userService.deleteUserFromUsersStore(this.people[0]._id);
        this.closeDialog();
        localStorage.setItem('notificationMessage', this.local['personDelete']);
      },
      (error) => {
        this.validationError = JSON.parse(error._body).message;
      }
    );
  }

  deletePeople() {
    this.userService.deleteUsers(this.company._id, this.people).subscribe(() => {
      this.people.forEach((item) => {
        this.userService.deleteUserFromUsersStore(item._id);
        this.userService.removeSelectUserInStore(item._id);
      });
      this.closeDialog();
      localStorage.setItem('notificationMessage', this.local['peopleDelete']);
    }, (error) => {
      this.validationError = JSON.parse(error._body).message;
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  transformPeopleObjects() {
    this.people.forEach((item, index) => {
      this.people[index] = {'_id': item, isActive: false};
    });
  }
}
