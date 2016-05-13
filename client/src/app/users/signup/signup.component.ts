import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { NgForm }    from '@angular/common';
import { MdInput } from '@angular2-material/input';
import { MdButton } from '@angular2-material/button';
import { MdCheckbox } from '@angular2-material/checkbox';
import { User } from '../user/user.model';

@Component({
  selector: `ngconf-register`,
  templateUrl : `app/users/signup/signup.component.html`, 
  styleUrls: ['app/users/signup/signup.component.css'],
  directives: [ROUTER_DIRECTIVES, MdButton, MdInput, MdCheckbox],
  providers: []
})
export /**
 * LoginComponent
 */
class SignupComponent {
  
  user: User = new User();
  
  constructor() {
    
  }
  
  onSubmit() {
    console.log(this.user);    
  }
}