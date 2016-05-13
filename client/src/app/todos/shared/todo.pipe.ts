import { Pipe, PipeTransform } from '@angular/core';

import { Todo } from '../todo.model';

@Pipe({ name: 'filter', pure: false })
export class Filter implements PipeTransform {
  transform(allTodos: Todo[], args) {
    return allTodos.filter(todo => {
      return args.completed != undefined ? args.completed == todo.completed : true
    });
  }
}