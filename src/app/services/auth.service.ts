import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Router} from '@angular/router';
// Service
import {CookieService} from 'ngx-cookie';
import {HttpService} from './http.service';
import {UserService} from './user.service';
// Helper
import {JwtHelper} from 'angular2-jwt';
// rxJs
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
// API
import {environment} from 'environments/environment';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class AuthService {

  constructor(private http: Http,
              private userService: UserService,
              private httpService: HttpService,
              private router: Router,
              private jwtHelper: JwtHelper,
              private cookieService: CookieService) {
  }

  /**
   * @description - Method for user authorization
   * @param {{}} credentials
   * @returns {Observable}
   * @memberOf AuthService
   */
  signIn(credentials: object): Observable<any> {
    return this.http.put(`${API_ENDPOINT}/auth`, credentials, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json());
  }

  /**
   * @description Send request to forgot password`
   * @param {any} body
   * @returns {Observable}
   * @memberOf AuthService
   */
  sendResetEmail(body: object): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/auth/forgot-password`, body)
    .map(() => 'success');
  }

  /**
   * @description Send request to reset password`
   * @param {any} body
   * @returns {Observable}
   * @memberOf AuthService
   */
  resetPass(body): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/auth/new-password`, body, this.httpService.generateHttpHeaders())
    .map(() => 'success');
  }

  /**
   * @description Send request to change password`
   * @param {any} body
   * @returns {Observable}
   * @memberOf AuthService
   */
  changePassword(body): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/auth/change-password`, body, this.httpService.generateHttpHeaders())
    .map(() => 'success');
  }

  /**
   * @description - Method for set auth token to cookie`
   * @param {any} token
   * @memberOf AuthService
   */
  setAuthTokenToStorage(token) {
    this.cookieService.put('accessToken', token, {'expires': this.jwtHelper.getTokenExpirationDate(token)});
  }

  /**
   * @description - Method for set reset token to cookie`
   * @param {any} token
   * @memberOf AuthService
   */
  setAuthTokenToStorageReset(token) {
    this.cookieService.put('accessTokenReset', token, {'expires': this.jwtHelper.getTokenExpirationDate(token)});
  }

  /**
   * @description - Method for return access token in cookie
   * @returns string
   * @memberOf AuthService
   */
  getAuthTokenFromStorage() {
    return this.cookieService.get('accessToken');
  }

  /**
   * @description - Method for log out
   * > Remove user info from AuthService and cookies
   * > Redirect to login page
   * @returns {boolean}
   * @memberOf AuthService
   */
  logOut() {
    this.clearUser();
    this.router.navigate(['auth/sign-in']);
    return false;
  }

  /**
   * @description - Method for clear User data
   * > Remove user info from AuthService and cookies
   * @returns {boolean}
   * @memberOf AuthService
   */
  clearUser() {
    this.userService.clearLoggedUserData();
    this.cookieService.removeAll();
    this.userService.removeSelectUsersInStore();
  }

}
