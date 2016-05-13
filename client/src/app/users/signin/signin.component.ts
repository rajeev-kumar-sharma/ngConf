import { Component } from '@angular/core';
import { NgForm } from '@angular/common';
import { Http, Headers } from '@angular/http';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { MdInput } from '@angular2-material/input';
import { MdButton } from '@angular2-material/button';
declare let componentHandler: any; // need to use external in angular2? Ok no pb, but declare it before like that

@Component({
  selector: `ngconf-login`,
  templateUrl: `app/users/signin/signin.component.html`,
  styleUrls: ['app/users/signin/signin.component.css'],
  directives: [ROUTER_DIRECTIVES, NgForm, MdInput, MdButton],
  providers: []
})
export /**
 * LoginComponent
 */
  class SigninComponent {

  user = {
    email: '',
    password: ''
  }

  headers: Headers = new Headers();
  
  constructor(private router: Router, private _http: Http) {
    this.headers.append('Content-Type', 'application/json');
  }
  
  setAuthToken(res: any) {
    if (res.auth_token) {
      localStorage.setItem('auth_token', res.auth_token);
      localStorage.setItem('id_token', res.auth_token);
    }
  }

  onSubmit() {    
    this._http.post('http://localhost:5000/api/authenticate', JSON.stringify(this.user), {headers: this.headers})
      .subscribe(
        res => this.setAuthToken(res.json()),
        err => console.log(err),
        () => this.router.navigate(['/todos'])        
      )
  }  
  
}