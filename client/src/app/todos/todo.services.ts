import { Inject, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Todo } from './todo.model';
import { GET, PUT, POST, DELETE, Body, Path } from '../rest';
import { AuthFactory } from '../shared/auth';

@Injectable()
export /**
 * TodoService
 */
class TodoService {
  
  headers: Headers = new Headers();
  
  constructor(private _http: Http) {
    this.headers.append('Content-Type', 'application/json');
  }
  
  loadAll() {
    return this._http.get(`http://localhost:5000/api/todos`, {search: `auth_token=${localStorage.getItem('auth_token')}`});
  }
  
  load(todoId: string) {
    // TODO
  }
  
  create(todo: Todo) {
    return this._http.post(`http://localhost:5000/api/todos`, JSON.stringify(todo), { headers: this.headers, search: `auth_token=${localStorage.getItem('auth_token')}` });
  }
  
  update(todoId: string, todo: any) {
    return this._http.put(`http://localhost:5000/api/todos/${todoId}`, JSON.stringify(todo), { headers: this.headers, search: `auth_token=${localStorage.getItem('auth_token')}` });
  }
  
  remove(todoId: string) {
    return this._http.delete(`http://localhost:5000/api/todos/${todoId}`, { headers: this.headers, search: `auth_token=${localStorage.getItem('auth_token')}` });
  }
  
  // decorator version
  
  // constructor(_http: Http) {
  //   super(_http);
  // }
  
  // @GET('/todos')
  // loadAll() {
  //   return null;
  // }
  
  // @POST('/todos')
  // create(@Body todo: Todo) {
  //   return null;
  // }
  
  // @PUT('/todos/{todoId}')
  // update(@Path("todoId") todoId: string, @Body todo: any) {
  //   return null;
  // }
  
  // @DELETE('/todos/{todoId}')
  // remove(@Path("todoId") todoId: string) {
  //   return null;
  // }
  
}