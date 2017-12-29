import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
// service
import {HttpService} from './http.service';
// rxJs
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LocaleService {
  private languagesStore: object;

  constructor(private http: Http, private httpService: HttpService) {
    this.languagesStore = {};
  }

  /**
   * @description - Method for upload language file
   * @param {string} name
   * @returns {Observable}
   * @memberOf LocaleService
   */
  getLanguages(name: string): Observable<any> {
    return this.http.get(`/assets/locale/${name}.json`, this.httpService.generateHttpHeaders())
    .map((res) => res.json());
  }

  /**
   * @description - Method for set languages in service store
   * @memberOf LocaleService
   * @constructor
   * @param {object} data - languages date.
   */
  setLanguagesStore(data: object): void {
    Object.assign(this.languagesStore, data);
  }

  /**
   * @description - Method witch clear languages store in service
   * @memberOf LocaleService
   */
  clearLanguagesStore() {
    Object.assign(this.languagesStore, {});
  }

  /**
   * @description - Method witch return languages list
   * @returns Promise
   * @memberOf LocaleService
   */
  getLanguagesStore(): Promise<any> {
    return Promise.resolve(this.languagesStore);
  }

}
