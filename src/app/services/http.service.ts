import {Injectable} from '@angular/core';
import {Headers, RequestOptions} from '@angular/http';
import {CookieService} from 'ngx-cookie';

@Injectable()
export class HttpService {

  constructor(private cookieService: CookieService) {
  }

  /**
   * @description - Generate authorization header with jwt token
   * @returns {RequestOptions}
   * @memberOf HttpService
   */
  generateHttpHeaders(): RequestOptions {
    const headers = new Headers({'Authorization': this.cookieService.get('accessToken') || this.cookieService.get('accessTokenReset')});
    const options = new RequestOptions({headers: headers});
    return options;
  }

  generateQueryToken() {
    return `?Authorization=${this.cookieService.get('accessToken') || this.cookieService.get('accessTokenReset')}`
  }
}
