import {Injectable} from '@angular/core';
// models
import {Language} from '../models/language.interface';

@Injectable()
export class LanguagesService {
  private languagesStore = [
    {id: 'fr', name: 'French'},
    {id: 'en', name: 'English'}
  ];

  constructor() {
  }

  /**
   * @description - Method for return languages list
   * @returns Promise
   * @memberOf LanguagesService
   */
  getLanguages(): Promise<Language[]> {
    return Promise.resolve(this.languagesStore);
  }

}

