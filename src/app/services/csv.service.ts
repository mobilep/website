import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
// service
import {HttpService} from './http.service';
// environment
import {environment} from 'environments/environment';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class CSVService {

  constructor(private httpService: HttpService, private http: Http) {
  }

  /**
   * @description - Made request for Upload CSV File of User List
   * @memberOf CSVService
   * @constructor
   * @param {string} id - Company id.
   * @param {object} body - The body of the File CSV.
   * @returns {Observable}
   */
  importUsers(id: string, body: FormData) {
    return this.http.post(`${API_ENDPOINT}/company/${id}/import`, body, this.httpService.generateHttpHeaders())
    .map(res => res.json());
  }

  /**
   * @description - Made request for export CSV File of reporting
   * @memberOf CSVService
   * @constructor
   * @param {string} id - Company id.
   * @returns {Observable}
   */
  exportReportingLink(id: string) {
    return `${API_ENDPOINT}/${id}/export/${this.httpService.generateQueryToken()}`
  }

}
