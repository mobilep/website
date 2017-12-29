import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
// ToastsManager
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
// MD
import {MdDialog} from '@angular/material';
// components
import {PeopleDeleteComponent} from '../people-delete/people-delete.component';
import {SendEmailComponent} from 'app/components/common/send-email/send-email.component';
// rxJs
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
// service
import {CountriesService} from 'app/services/countries.service';
import {LanguagesService} from 'app/services/languages.service';
import {LocaleService} from 'app/services/locale.service';
import {UserService} from 'app/services/user.service';
import {CSVService} from 'app/services/csv.service';

@Component({
  selector: 'mpw-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.sass']
})
export class PeopleListComponent implements OnInit, OnDestroy {
  private selectCompany: string;
  public people: any;
  public loaded: boolean;
  private subscribeUrl: any;
  public selectedAll: any;
  public languages: any[];
  public countries: any[];
  public selectUsers: any[];
  public local;
  public searchRef;
  public term$ = new Subject<string>();
  public searchTouched: boolean;

  constructor(private countriesService: CountriesService,
              private languagesService: LanguagesService,
              private localeService: LocaleService,
              private userService: UserService,
              private csvService: CSVService,
              private router: Router,
              public dialog: MdDialog,
              public toasts: ToastsManager,
              private route: ActivatedRoute,
              vcr: ViewContainerRef) {
    this.selectedAll = false;
    this.loaded = true;
    this.people = [];
    this.selectUsers = [];
    this.searchTouched = false;
    this.toasts.setRootViewContainerRef(vcr);
    this.getCompanyIdFromURL();
    this.subscribeDialog();
  }

  ngOnInit(): void {
    this.subscribeUrlFn();
    this.getAllPeople();
    this.subSearch();
    this.getLanguage();
    this.getSelectUsersFromStore();
    this.getLanguages();
    this.getCountries();
  }

  getLanguage() {
    this.localeService.getLanguagesStore().then((res) => {
      this.local = res;
    });
  }

  getLanguages() {
    this.languagesService.getLanguages().then((res) => {
      this.languages = res
    });
  }

  getCountries() {
    this.countriesService.getCountries().then((res) => {
      this.countries = res
    });
  }

  ngOnDestroy(): void {
    this.subscribeUrl.unsubscribe();
  }

  // SEARCH

  subSearch() {
    this.userService.searchUser(this.selectCompany, this.term$).subscribe((res) => {
      this.clearPeopleData();
      this.addFlagSelectedInUser(res);
      this.searchTouched = true;
    }, (error) => {
      console.error(error);
      this.term$.complete();
      this.searchTouched = false;
      this.term$ = new Subject<string>();
      this.subSearch();
    });
  }

  clearSearch() {
    this.term$.next('');
    this.searchRef = '';
  }

  destroySearch() {
    this.term$.complete();
    this.searchTouched = false;
    this.clearSearch();
  }

  // URL

  subscribeUrlFn() {
    this.subscribeUrl = this.router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe(() => {
      this.userService.removeSelectUsersInStore();
      this.loaded = true;
      this.destroySearch();
      this.clearPeopleData();
      this.clearSelectAll();

      this.getCompanyIdFromURL();
      this.getAllPeople();

      this.term$ = new Subject<string>();
      this.subSearch();
    });
  }

  getCompanyIdFromURL() {
    this.selectCompany = this.route.snapshot.pathFromRoot[1].url[1].path;
  }

  // Dialog

  subscribeDialog() {
    this.dialog.afterAllClosed.subscribe(() => {
      this.checkLocalStorage();
      // this.clearSelectAll();
      this.getSelectUsersFromStore();
      this.getUsersFromUsersStore();
    });
  }

  getUsersFromUsersStore() {
    this.userService.getUsersFromUsersStore().then((res) => {
      this.people.length = 0;
      res.forEach(user => {
        this.people.push(user);
      });
    });
  }

  getSelectUsersFromStore() {
    this.selectUsers.length = 0;
    this.userService.getSelectUsersFromStore().then((res) => {
      res.forEach(user => {
        this.selectUsers.push(user);
      });
    });
  }

  getScreenHeight(num) {
    if (window.outerHeight < num) {
      return '300px';
    } else {
      return 'initial';
    }
  }

  // Toasts

  checkLocalStorage() {
    if (localStorage.getItem('notificationMessage')) {
      const message = localStorage.getItem('notificationMessage');
      this.showToasts(message);
      setTimeout(() => {
        localStorage.removeItem('notificationMessage');
      }, 3000);
    }
  }

  showToasts(text, type?) {
    if (type && type === 'error') {
      this.toasts.custom(`<span>${text}</span>`, null, {enableHTML: true});
    } else {
      this.toasts.custom(`<i class="icon-check"></i><span>${text}</span>`, null, {enableHTML: true});
    }
  }

  // PEOPLE

  getAllPeople() {
    this.loaded = true;
    this.userService.getUsersInCompany(this.selectCompany).subscribe(
      (res) => {
        this.addFlagSelectedInUser(res);
        this.loaded = false;
        this.checkLocalStorage();
      },
      () => {
        this.loaded = false;
        this.router.navigate(['/']);
      }
    );
  }

  deleteUsers(users) {
    this.dialog.open(PeopleDeleteComponent, {
      width: '350px',
      data: users,
      position: {
        top: '20px'
      }
    });
  }

  removeAllUsers() {
    this.deleteUsers(this.selectUsers);
  }

  deletePerson(person) {
    const onePerson = [];
    onePerson.push(person._id);
    this.deleteUsers(onePerson);
  }

  clearPeopleData() {
    this.people.length = 0;
    this.userService.clearLoggedUserData();
  }

  // SElECT PEOPLE

  onSelectAll() {
    for (let i = 0; i < this.people.length; i++) {
      this.people[i].isSelected = this.selectedAll;
      if (this.selectedAll) {
        this.userService.addSelectUsersInStore(this.people[i]._id);
      }
    }
    if (!this.selectedAll) {
      this.userService.removeSelectUsersInStore();
    }
    this.pushSelectUsers();
  }

  addFlagSelectedInUser(people) {
    const allPeople = [];
    if (people.length) {
      people.forEach((item) => {
        item['isSelected'] = false;
        if (this.selectUsers.length) {
          this.selectUsers.forEach((uid) => {
            if (item._id === uid) {
              item['isSelected'] = true;
            }
          });
        }
        allPeople.push(item);
        this.people.push(item);
      });
    }
    this.userService.setUsersToUsersStore(allPeople);
  }

  clearSelectAll() {
    this.selectUsers.length = 0;
    this.selectedAll = false;
    if (this.people.length) {
      this.people.forEach((item) => {
        if (item.isSelected === true) {
          item.isSelected = false;
        }
      });
    }
  }

  checkIfAllSelected(uid) {
    if (this.selectUsers.indexOf(uid) === -1) {
      // add
      this.selectUsers.push(uid);
      this.userService.addSelectUsersInStore(uid);
    } else {
      // remove
      const index = this.selectUsers.findIndex((item) => item === uid);
      this.selectUsers.splice(index, 1);
      this.userService.removeSelectUserInStore(uid);
    }
  }

  pushSelectUsers() {
    this.selectUsers.length = 0;
    this.people.forEach((item) => {
      if (item.isSelected === true) {
        this.selectUsers.push(item._id);
      }
    });
  }

  // GO TO Edit PAGE

  goToEdit(uid) {
    return this.router.navigate([`/company/${ this.selectCompany }/people/edit`, uid]);
  }

  // SEND EMAIL

  sendOneEmail(uid) {
    const selectedUser = [uid];

    this.dialog.open(SendEmailComponent, {
      width: '460px',
      height: this.getScreenHeight(550),
      data: selectedUser,
      position: {
        top: '20px'
      }
    });
  }

  sendEmailAllUsers() {
    this.dialog.open(SendEmailComponent, {
      width: '460px',
      height: this.getScreenHeight(550),
      data: this.selectUsers,
      position: {
        top: '20px'
      }
    });
  }

  // Dropdown component

  toggleTouchFn(event) {
    const dropDownList = event.target.closest('body').querySelectorAll('.select-style');
    const dropDownParent = event.target.closest('.select-style');

    if (dropDownParent.classList.contains('select-style_active')) {
      dropDownParent.classList.remove('select-style_active');
    } else {
      if (dropDownList.length) {
        for (let i = 0; i < dropDownList.length; i++) {
          dropDownList[i].classList.remove('select-style_active');
        }
      }
      dropDownParent.classList.add('select-style_active');
    }
  }

  toggleClickFn(event) {
    event.target.classList.add('select-style_active');
  }

  toggleLeaveFn(event) {
    event.target.classList.remove('select-style_active');
  }

  fileOnChange(fileInput: any) {
    const fileList: FileList = fileInput.target.files;

    if (fileList.length > 0) {

      const file: File = fileList[0];
      const formData: FormData = new FormData();

      formData.append('importCsvFile', file);

      if (file.size > 50555052) {
        this.showToasts(this.local.firstSizeExceeds, 'error');
        return false;
      }

      this.loaded = true;

      this.csvService.importUsers(this.selectCompany, formData).subscribe((res) => {
        this.loaded = false;
        let text = '';

        if (res.addedUsers === 1) {
          text += `1 person has been added successfully; `
        } else if (res.addedUsers > 1) {
          text += `${res.addedUsers} people have been added successfully; `
        } else {
          text += `No people added; `
        }

        if (res.failedUsers === 1) {
          text += `1 person has error; `
        } else if (res.failedUsers > 1) {
          text += `${res.failedUsers} people have some errors; `
        }

        if (res.errorMessage) {
          text += `the first error: ${res.errorMessage}`
        }

        this.showToasts(text, 'error');
        this.clearPeopleData();
        this.getAllPeople();

        fileInput.target.value = '';

      }, (error) => {
        this.loaded = false;

        if (error && error._body) {
          this.showToasts(JSON.parse(error._body).message, 'error');
        } else {
          this.showToasts('Upload failed, please try again', 'error');
        }

      });
    }
  }
}
