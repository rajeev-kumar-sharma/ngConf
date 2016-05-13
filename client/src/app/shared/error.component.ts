import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { ErrorService } from './error.service';

@Component({
  selector: `ngconf-error`,
  templateUrl: `app/shared/error.component.html`,
  styleUrls: ['app/shared/error.component.css'],
  directives: [NgClass],
  providers: [ErrorService]
})
export class ErrorComponent {
  errorHandler: ErrorService
  constructor(errorService: ErrorService) {
    this.errorHandler = errorService;
  }
}