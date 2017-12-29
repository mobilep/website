import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
// service
import {HttpService} from './http.service';
// rxJs
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
// models
import {COMPANY} from 'app/models/company';
// environment
import {environment} from 'environments/environment';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class CompaniesService {
  private companiesStore;
  private selectedCompanyStore;

  constructor(private http: Http,
              private httpService: HttpService) {
    this.companiesStore = [];
    this.selectedCompanyStore = {};
  }

  /**
   * @description - Made request to get all companies
   * @memberOf CompaniesService
   * @constructor
   * @returns {Observable}
   */
  getCompanies(): Observable<COMPANY[]> {
    return this.http.get(`${API_ENDPOINT}/company`, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json()
    .filter(item => item.isActive === true))
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  /**
   * @description - Made request for Add Company
   * @memberOf CompaniesService
   * @constructor
   * @param {object} body - The body of the company form.
   * @returns {Observable}
   */
  addCompany(body: object): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/company`, body, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  /**
   * @description - Made request for Update Company
   * @memberOf CompaniesService
   * @constructor
   * @param {string} id - Company id.
   * @param {object} body - The body of the company form.
   * @returns {Observable}
   */
  updateCompany(id: string, body: object): Observable<any> {
    return this.http.patch(`${API_ENDPOINT}/company/${id}`, body, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  /**
   * @description - Made request for Remove Company
   * @memberOf CompaniesService
   * @constructor
   * @param {string} id - Company id.
   * @returns {Observable}
   */
  removeCompany(id: string): Observable<any> {
    return this.http.delete(`${API_ENDPOINT}/company/${id}`, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  /**
   * @description - Made request for get Company info
   * @returns {Observable}
   * @memberOf CompaniesService
   * @constructor
   * @param {string} id - Company id.
   */
  getCompanyInfo(id: string): Observable<any> {
    return this.http.get(`${API_ENDPOINT}/company/${id}`, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  /**
   * @description - Made witch invite users to company
   * @returns {Observable}
   * @memberOf CompaniesService
   * @constructor
   * @param {string} companyId - company id
   * @param {any} body - body from select user.
   */
  inviteUserToCompany(companyId: string, body): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/company/${companyId}/user`, body, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json());
  }

  /**
   * @description - Method for send invite email to user
   * @returns {Observable}
   * @memberOf CompaniesService
   * @constructor
   * @param {string} companyId - company id
   * @param {any} body - body from select user.
   */
  sendInviteEmailToUser(companyId: string, body): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/company/${companyId}/invite`, body, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json());
  }

  /**
   * @description - Method for send invite to costume email address
   * @returns {Observable}
   * @memberOf CompaniesService
   * @constructor
   * @param {string} companyId - company id
   * @param {any} body - costume email address.
   */
  sendTestEmail(companyId: string, body): Observable<any> {
    return this.http.post(`${API_ENDPOINT}/company/${companyId}/sendTestEmail`, body, this.httpService.generateHttpHeaders())
    .map((res: Response) => res.json());
  }

  /**
   * @description - Method for return list companies in store
   * @memberOf CompaniesService
   * @returns Promise
   */
  getCompaniesStore(): Promise<COMPANY[]> {
    return Promise.resolve(this.companiesStore);
  }

  /**
   * @description - Method for set companies in store
   * @memberOf CompaniesService
   * @constructor
   * @param {array} res - array companies
   */
  setCompaniesStore(res) {
    this.companiesStore.length = 0;
    res.forEach(element => {
      this.companiesStore.push(element);
    });
  }

  /**
   * @description - Method for set company to store
   * @memberOf CompaniesService
   * @constructor
   * @param {object} company - object company
   */
  setCompanyToStore(company) {
    this.companiesStore.push(company);
  }

  /**
   * @description - Method for delete company from store
   * @memberOf CompaniesService
   * @constructor
   * @param {string} id - company id
   */
  deleteCompanyFromStore(id) {
    const index = this.companiesStore.findIndex((company) => company._id === id);
    this.companiesStore.splice(index, 1);
  }

  /**
   * @description - Method for update company in store
   * @memberOf CompaniesService
   * @constructor
   * @param {object} company - object company
   */
  updateCompanyInStore(company) {
    const index = this.companiesStore.findIndex((item) => item._id === company._id);
    this.companiesStore.splice(index, 1, company);
  }

  /**
   * @description - Method for add company in store
   * @memberOf CompaniesService
   * @constructor
   * @param {object} company - object company
   */
  addCompanyInStore(company) {
    this.companiesStore.push(company);
  }

  /**
   * @description - Method for select company in store
   * @memberOf CompaniesService
   * @constructor
   * @param {object} company - object company
   */
  selectCompanyInStore(company) {
    Object.assign(this.selectedCompanyStore, company);
  }

  /**
   * @description - Method for update Selected company in store
   * @memberOf CompaniesService
   * @constructor
   * @param {object} updateCompany - object company
   */
  updateSelectedCompanyInStore(updateCompany) {
    Object.assign(this.selectedCompanyStore, updateCompany);
  }

  /**
   * @description - Method for return list selected company in store
   * @memberOf CompaniesService
   * @returns Promise
   */
  getSelectedCompanyStore(): Promise<COMPANY> {
    return Promise.resolve(this.selectedCompanyStore);
  }

}
