import {Inject, Injectable} from '@angular/core';
import {Http, Headers, Request, RequestOptions, RequestOptionsArgs, RequestMethod, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/**
 * @interface IAuthConfig
 * Contract for Authentication decorator
 */
export interface IAuthConfig {
  headerName: string;
  headerPrefix: string;
  tokenName: string;
  tokenGetter: any;
  noJwtError: boolean;
  defaultHeaders: Object;
}

/**
 * Supported @Produces media types
 */
export enum MediaType {
  JSON
}

/**
 * Set the base URL of REST resource
 * @param {String} url - base URL
 */
export function BaseUrl(url: string) {
  return function <TFunction extends Function>(Target: TFunction): TFunction {
    Target.prototype.getBaseUrl = function () {
      return url;
    }
    return Target;
  }
}

/**
 * Set the authentication for every method of REST resource
 * @param {Object} AuthConf - authentication headers and token
 */
export function Authentication(conf: any) {
  return function <TFunction extends Function>(Target: TFunction): TFunction {
    Target.prototype.authentication = {
      headerName: conf.headerName || 'Authorization',
      headerPrefix: conf.headerPrefix ? `${conf.headerPrefix} ` : 'Bearer ',
      tokenName: conf.tokenName || 'id_token',
      noJwtError: conf.noJwtError || false,
      tokenGetter: conf.tokenGetter || (() => localStorage.getItem(conf.tokenName || 'id_token')),
      defaultHeaders: conf.defaultHeaders || {}
    }
    return Target;
  }
}

/**
 * Create a http call to taget server
 * @param {Object} req - Request
 */
function request(req: Request): Observable<Response> {
  let request: any;

  if (!tokenNotExpired(null, this.authentication.tokenGetter())) {
    if (!this.authentication.noJwtError) {
      if (this.authentication.defaultHeaders) {
        req.headers.set(this.authentication.headerName, this.authentication.headerPrefix + this.authentication.tokenGetter());
        request = this.http.request(req);
      }
      // return new Observable((obs: any) => {
      //   obs.error(new Error('No JWT present'));
      // });
    } else {
      request = this.http.request(req)
    }
  } else {
    if (this.authentication.defaultHeaders) {
      req.headers.set(this.authentication.headerName, this.authentication.headerPrefix + this.authentication.tokenGetter());
      request = this.http.request(req);
    }
  }
  return request;
}

/**
 * Set param in rest method
 * @param {String} paramName - parameter for method
 */
function paramHelper(paramName: string) {
  return function (key: string) {
    return function (target: RestService, propertyKey: string | symbol, parameterIndex: number) {
      let metadataKey: string = `${propertyKey}_${paramName}_parameters`;
      let paramObj: any = {
        key: key,
        parameterIndex: parameterIndex
      };
      if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(paramObj);
      } else {
        target[metadataKey] = [paramObj];
      }
    };
  };
}

/**
 * Set request header and conf
 * @param {Number} method - Http request method enum
 */
function requestHelper(method: number) {
  return function (url: string) {
    return function (target: RestService, propertyKey: string, descriptor: PropertyDescriptor) {

      let pPath: any = target[`${propertyKey}_Path_parameters`];
      let pQuery: any = target[`${propertyKey}_Query_parameters`];
      let pBody: any = target[`${propertyKey}_Body_parameters`];
      let pHeader: any = target[`${propertyKey}_Header_parameters`];

      descriptor.value = function (...args: any[]) {
        // Body
        let body: any = null;
        if (pBody) {
          body = JSON.stringify(args[pBody[0].parameterIndex]);
        }

        // Path
        let resUrl: string = url;
        if (pPath) {
          for (var k in pPath) {
            if (pPath.hasOwnProperty(k)) {
              resUrl = resUrl.replace(`{${pPath[k].key}}`, args[pPath[k].parameterIndex]);
            }
          }
        }

        // Query
        let search: URLSearchParams = new URLSearchParams();
        if (pQuery) {
          pQuery
            .filter(p => args[p.parameterIndex]) // filter out optional parameters
            .forEach(p => {
              let key: any = p.key;
              let value = args[p.parameterIndex];
              // if the value is a instance of Object, we stringify it
              if (value instanceof Object) {
                value = JSON.stringify(value);
              }
              search.set(encodeURIComponent(key), encodeURIComponent(value));
            });
        }

        let headers: Headers = new Headers(this.authentication.defaultHeaders);
        // set parameter specific headers
        if (pHeader) {
          for (let k in pHeader) {
            if (pHeader.hasOwnProperty(k)) {
              headers.append(pHeader[k].key, args[pHeader[k].parameterIndex]);
            }
          }
        }

        let options: RequestOptions = new RequestOptions({
          method,
          headers,
          body,
          url: this.getBaseUrl() + resUrl,
          search
        });

        let req: Request = new Request(options);

        // intercept the request
        this.requestInterceptor(req);

        let res: Observable<Response> = request.call(this, req);

        res = res.map(res => res.json());

        // intercept the response
        res = this.responseInterceptor(res);

        return res;
      }
      return descriptor;
    }
  }
}

/**
 * Defines the media type(s) that the methods can produce
 * @param MediaType producesDef - mediaType to be parsed
 */
export function Produces(producesDef: MediaType) {
  return function (target: RestService, propertyKey: string, descriptor: any) {
    descriptor.isJSON = producesDef === MediaType.JSON;
    return descriptor;
  };
}

/**
 * Path variable of a method's url, type: string
 * @param {string} key - path key to bind value
 */
export var Path = paramHelper("Path");
/**
 * Query value of a method's url, type: string
 * @param {string} key - query key to bind value
 */
export var Query = paramHelper("Query");
/**
 * Body of a REST method, type: key-value pair object
 * Only one body per method!
 */
export var Body = paramHelper("Body")("Body");
/**
 * Custom header of a REST method, type: string
 * @param {string} key - header key to bind value
 */
export var Header = paramHelper("Header");

/**
 * GET method
 * @param {string} url - resource url of the method
 */
export var GET = requestHelper(RequestMethod.Get);
/**
 * POST method
 * @param {string} url - resource url of the method
 */
export var POST = requestHelper(RequestMethod.Post);
/**
 * PUT method
 * @param {string} url - resource url of the method
 */
export var PUT = requestHelper(RequestMethod.Put);
/**
 * DELETE method
 * @param {string} url - resource url of the method
 */
export var DELETE = requestHelper(RequestMethod.Delete);
/**
 * HEAD method
 * @param {string} url - resource url of the method
 */
export var HEAD = requestHelper(RequestMethod.Head);

/**
 * Checks for presence of token and that token hasn't expired.
 */
export function tokenNotExpired(tokenName?: string, jwt?: string): boolean {
  let authToken: string = tokenName || 'id_token';
  let token: string = jwt || localStorage.getItem(authToken);

  var jwtHelper = new JwtHelper();

  if (!token || jwtHelper.isTokenExpired(token, null)) {
    return false;
  } else {
    return true;
  }
}

export /**
 * @class RestService
 * @constructor
 */
  class RestService {
  public constructor(protected http: Http) {

  }

  /**
    * BaseUrl getter
    *
    * @method getBaseUrl
    */
  protected getBaseUrl(): string {
    return null;
  }

  /**
    * Request Interceptor
    *
    * @method requestInterceptor
    * @param {Request} req - request object
    */
  protected requestInterceptor(req: Request): Observable<Response> {
    return null;
  }

  /**
    * Response Interceptor
    *
    * @method responseInterceptor
    * @param {Response} res - response object
    * @returns {Response} res - transformed response object
    */
  protected responseInterceptor(res: Observable<Response>): Observable<Response> {
    return res;
  }

  /**
   * Base64 URL Decoder
   * 
   * @method urlBase64Decode
   * @param {String} str - base64 encoded url
   * @returns {String} str - base64 decoded url
   */
  public urlBase64Decode(str: string): string {
    let output: string = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: { break; }
      case 2: { output += '=='; break; }
      case 3: { output += '='; break; }
      default: {
        throw 'Illegal base64url string!';
      }
    }

    return decodeURIComponent(encodeURIComponent(window.atob(output)));
  }

  /**
   * Decode JWT
   * 
   * @method decodeToken
   * @param {String} token - jwt
   * @returns {String} token - decoded jwt
   */
  public decodeToken(token: string): string {
    let parts: string[] = token.split('.');

    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }

    let decoded: string = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }

    return JSON.parse(decoded);
  }

  /**
   * JWT Expiration Date
   * 
   * @method getTokenExpirationDate
   * @param {String} token - jwt
   * @returns {Date} date - jwt expiration date
   */
  public getTokenExpirationDate(token: string): Date {
    let decoded: any;
    decoded = this.decodeToken(token);

    if (typeof decoded.exp === "undefined") {
      return null;
    }

    var date: Date = new Date(0); // The 0 here is the key, which sets the date to the epoch
    date.setUTCSeconds(decoded.exp);

    return date;
  }

  /**
   * Check JWT Expired or Not
   * 
   * @method isTokenExpired
   * @param {String, Number?} token, offsetSeconds? - jwt, grace period
   * @returns {Boolean}
   */
  public isTokenExpired(token: string, offsetSeconds?: number): boolean {
    let date: Date = this.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;
    if (date === null) {
      return false;
    }

    // Token expired?
    return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
  }

}

export /**
 * @class JwtHelper
 * 
 * Helper class to decode and find JWT expiration.
 */
  class JwtHelper {
  constructor() {

  }

  /**
   * Base64 URL Decoder
   * 
   * @method urlBase64Decode
   * @param {String} str - base64 encoded url
   * @returns {String} str - base64 decoded url
   */
  public urlBase64Decode(str: string): string {
    let output: string = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: { break; }
      case 2: { output += '=='; break; }
      case 3: { output += '='; break; }
      default: {
        throw 'Illegal base64url string!';
      }
    }

    return decodeURIComponent(encodeURIComponent(window.atob(output)));
  }

  /**
   * Decode JWT
   * 
   * @method decodeToken
   * @param {String} token - jwt
   * @returns {String} token - decoded jwt
   */
  public decodeToken(token: string): string {
    let parts: string[] = token.split('.');

    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }

    let decoded: string = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }

    return JSON.parse(decoded);
  }

  /**
   * JWT Expiration Date
   * 
   * @method getTokenExpirationDate
   * @param {String} token - jwt
   * @returns {Date} date - jwt expiration date
   */
  public getTokenExpirationDate(token: string): Date {
    let decoded: any;
    decoded = this.decodeToken(token);

    if (typeof decoded.exp === "undefined") {
      return null;
    }

    var date: Date = new Date(0); // The 0 here is the key, which sets the date to the epoch
    date.setUTCSeconds(decoded.exp);

    return date;
  }

  /**
   * Check JWT Expired or Not
   * 
   * @method isTokenExpired
   * @param {String, Number?} token, offsetSeconds? - jwt, grace period
   * @returns {Boolean}
   */
  public isTokenExpired(token: string, offsetSeconds?: number): boolean {
    let date: Date = this.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;
    if (date === null) {
      return false;
    }

    // Token expired?
    return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
  }


}