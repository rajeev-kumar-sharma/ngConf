import { Component } from '@angular/core';
import { NgForm } from '@angular/common';
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
    userName: '',
    password: ''
  }

  constructor(private router: Router) {

  }

  onSubmit() {
    console.log(this.user);
    this.router.navigate(['/todos']);
  }
}