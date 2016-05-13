import { Component } from '@angular/core';
import { NgForm } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { MdInput } from '@angular2-material/input';
import { MdButton } from '@angular2-material/button';
declare let componentHandler: any; // need to use external in angular2? Ok no pb, but declare it before like that

@Component({
  selector: `ngconf-login`,
  templateUrl: `app/todos/todo.component.html`,
  styleUrls: ['app/todos/todo.component.css'],
  directives: [ROUTER_DIRECTIVES, NgForm, MdInput, MdButton],
  providers: []
})
export /**
 * TodoComponent
 */
  class TodoComponent {
  constructor() {

  }
}