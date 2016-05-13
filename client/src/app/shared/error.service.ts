import { Injectable, ViewContainerRef } from '@angular/core';
// import {  } from '@angular/platform-browser';

@Injectable()
export class ErrorService {
  
  isSuccess: boolean = false;
  isError: boolean = false;
  isHidden: boolean = true;
  
  constructor() {
    // 
  }

  error() {

  }

  success() {

  }
  
}