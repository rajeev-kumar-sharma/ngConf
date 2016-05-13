import { Component, OnInit } from '@angular/core';
import { Router, Routes, ROUTER_DIRECTIVES } from '@angular/router';
import { Http } from '@angular/http';
import { ErrorComponent } from './shared/error.component';
import { SigninComponent } from './users/signin/signin.component';
import { SignupComponent } from './users/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { TodoComponent } from './todos/todo.component';

@Component({
  selector: `ngconf-app`,
  templateUrl: `app/app.component.html`,
  directives: [ROUTER_DIRECTIVES, ErrorComponent],
  providers: []
})
@Routes([
  { path: '/', component: HomeComponent },
  { path: '/signin', component: SigninComponent },
  { path: '/signup', component: SignupComponent },
  { path: '/todos', component: TodoComponent }
])
export class AppComponent implements OnInit {
  constructor(private router: Router) {
    
  }

  ngOnInit() {
    this.router.navigate(['/']);
  }
}