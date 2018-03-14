import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';

import { GLOBAL } from './global'

@Injectable()
export class UserService{
  public url:string;
  public register_url:string;
  public login_url:string;

  constructor(public _http: HttpClient){
    this.url = GLOBAL.url;
    this.register_url = GLOBAL.register_path;
    this.login_url = GLOBAL.login_path;
  }

  register(user: User): Observable<any>{
    let params = JSON.stringify(user);
    let http_headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + this.register_url, params, {headers: http_headers});
  }

  login(email, password): Observable<any>{
    let params = JSON.stringify({'email': email, 'password': password});
    let http_headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + this.login_url, params, {headers: http_headers});
  }
}
