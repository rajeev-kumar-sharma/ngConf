import { Injectable } from "@angular/core";
import { RestService, BaseUrl, Authentication } from '../rest';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
@BaseUrl('http://localhost:5000/api')
@Authentication({
  defaultHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
export /**
 * AuthFactory
 */
  class AuthFactory extends RestService {
  constructor(private _http: Http) {
    super(_http);
  }

  protected responseInterceptor(res: Observable<Response>): Observable<Response> {
    return res;
  }

}