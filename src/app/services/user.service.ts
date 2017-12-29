import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
// service
import {HttpService} from './http.service';
// rxJs
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
// environment
import {environment} from 'environments/environment';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class UserService {
  private loggedUserData: any;
  private usersStore: any;
  private selectUsers: any;

  constructor(private http: Http,
              private httpService: HttpService) {
    this.loggedUserData = {};
    this.usersStore = [];
    this.selectUsers = [];
  }

  /**
   * @description - Method for delete User
   * @returns {Observable}
   * @memberOf UserService
   * @constructor
   * @param {string} companyId - company id
   * @param {string} userId - user id
   */
  deleteUser(companyId, userId): Observable<any> {
    return this.http.delete(`${API_ENDPOINT}/company/${companyId}/user/${userId}`, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json());
  }

  /**
   * @description - Method for delete Users
   * @returns {Observable}
   * @memberOf UserService
   * @constructor
   * @param {string} companyId - company id
   * @param {array} usersArr - user ids
   */
  deleteUsers(companyId, usersArr): Observable<any> {
    return this.http.patch(`${API_ENDPOINT}/company/${companyId}/user`, usersArr, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json());
  }

  /**
   * @description - Method for edit user
   * @returns {Observable}
   * @memberOf UserService
   * @constructor
   * @param {string} companyId - company id
   * @param {string} userId - user id
   * @param {object} data - user object
   */
  editUser(companyId, userId, data): Observable<any> {
    return this.http.patch(`${API_ENDPOINT}/company/${companyId}/user/${userId}`, data, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json());
  }

  /**
   * @description - Method for get current user
   * @returns {Observable}
   * @memberOf UserService
   */
  getCurrentUser(): Observable<any> {
    return this.http.get(`${API_ENDPOINT}/user`, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json());
  }

  /**
   * @description - Method for get user by id
   * @returns {Observable}
   * @memberOf UserService
   * @constructor
   * @param {string} companyId - company id
   * @param {string} userId - user id
   */
  getUserInfo(companyId, userId): Observable<any> {
    return this.http.get(`${API_ENDPOINT}/company/${companyId}/user/${userId}`, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json());
  }

  /**
   * @description - Method for get users in company
   * @returns {Observable}
   * @memberOf UserService
   * @constructor
   * @param {string} companyId - company id
   */
  getUsersInCompany(companyId): Observable<any> {
    return this.http.get(`${API_ENDPOINT}/company/${companyId}/user`, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json()
    .filter(item => item.isActive === true));
  }

  /**
   * @description - Method for search users by word
   * @returns {Observable}
   * @memberOf UserService
   * @constructor
   * @param {string} companyId - company id
   * @param {any} terms - search word
   */
  searchUser(companyId, terms: Observable<string>) {
    return terms.debounceTime(400)
    .distinctUntilChanged()
    .switchMap(term => this.filterUsersInCompany(companyId, term));
  }

  /**
   * @description - Method for filter users in company
   * @returns {Observable}
   * @memberOf UserService
   * @constructor
   * @param {string} companyId - company id
   * @param {string} terms - search word
   */
  filterUsersInCompany(companyId, terms: string) {
    return this.http.get(`${API_ENDPOINT}/company/${companyId}/user?filter=${terms}`, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json()
    .filter(item => item.isActive === true));
  }

  /**
   * @description - Method for set Logged User Data
   * @constructor
   * @param {object} user object.
   * @memberOf UserService
   */
  setLoggedUserData(user) {
    Object.assign(this.loggedUserData, user);
  }

  /**
   * @description - Method for return Logged User Data
   * @returns object
   * @memberOf UserService
   */
  getLoggedUserData() {
    return this.loggedUserData;
  }

  /**
   * @description - Method for clear logged user data
   * @returns object
   * @memberOf UserService
   */
  clearLoggedUserData() {
    for (const prop of Object.keys(this.loggedUserData)) {
      delete this.loggedUserData[prop];
    }
  }

  /**
   * @description - Method for return Users list From Users Store
   * @returns Promise
   * @memberOf UserService
   */
  getUsersFromUsersStore(): Promise<any[]> {
    return Promise.resolve(this.usersStore);
  }

  /**
   * @description - Method for set users to users store
   * @memberOf UserService
   * @constructor
   * @param {array} users - user array
   */
  setUsersToUsersStore(users) {
    this.usersStore.length = 0;
    users.forEach(user => {
      this.usersStore.push(user);
    });
  }

  /**
   * @description - Method for delete User From Users Store
   * @memberOf UserService
   * @constructor
   * @param {string} id - user id
   */
  deleteUserFromUsersStore(id) {
    const index = this.usersStore.findIndex((user) => user._id === id);
    this.usersStore.splice(index, 1);
  }

  /**
   * @description - Method for return Select Users list From Store
   * @memberOf UserService
   * @returns Promise
   */
  getSelectUsersFromStore(): Promise<any[]> {
    return Promise.resolve(this.selectUsers);
  }

  /**
   * @description - Method for clear all Select Users from Store
   * @memberOf UserService
   */
  removeSelectUsersInStore() {
    this.selectUsers.length = 0;
  }

  /**
   * @description - Method for remove Select User from Store
   * @memberOf UserService
   * @constructor
   * @param {string} id - user id
   */
  removeSelectUserInStore(id) {
    const index = this.selectUsers.findIndex((item) => item === id);
    this.selectUsers.splice(index, 1);
  }

  /**
   * @description - Method for add Select Users In Store
   * @memberOf UserService
   * @constructor
   * @param {object} user - user
   */
  addSelectUsersInStore(user) {
    this.selectUsers.push(user);
  }

}
