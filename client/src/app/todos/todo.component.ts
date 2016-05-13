import { Component, OnInit } from '@angular/core';
import { NgForm, NgIf, NgStyle } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { MdInput } from '@angular2-material/input';
import { MdButton } from '@angular2-material/button';
import { Todo } from './todo.model';
import { Filter } from './shared/todo.pipe';
import { TodoService } from './todo.services';
declare let componentHandler: any; // need to use external in angular2? Ok no pb, but declare it before like that

@Component({
  selector: `ngconf-login`,
  templateUrl: `app/todos/todo.component.html`,
  styleUrls: ['app/todos/todo.component.css'],
  directives: [ROUTER_DIRECTIVES, NgForm, NgIf, NgStyle, MdInput, MdButton],
  providers: [TodoService],
  pipes: [Filter]
})
export /**
 * TodoComponent
 */
  class TodoComponent implements OnInit {
    
  todos: Array<Todo> = [];
  
  todo: Todo = new Todo();
  
  filters: Array<Object> = [{title: 'All'}, {title: 'Active', completed: false}, {title: 'Completed', completed: true}];
  activeFilter: Object = {title: 'All'};
  
  constructor(private todoService: TodoService) {
    
  }
  
  filterList(filter) {
    this.activeFilter = filter;
    console.log(filter);
  }
  
  onSubmit() {
    if (this.todo.title.length) {
      this.todo.completed = false;
      this.todoService.create(this.todo)
        .subscribe(
          res => this.todos.push(res.json()),
          err => console.log(err),
          () => console.log('Todo added successfully')
        );
    }
  }
  
  toggleDone(event, todo) {
    todo.completed = !todo.completed;
    this.todoService.update(todo._id, {completed: todo.completed})
      .subscribe(
        res => res.json(),
        err => console.log(err)
      );
  }
  
  clearCompleted() {
    let completedTasks: Array<Todo> = this.todos.filter(todo => todo.completed);
    completedTasks.forEach(task => {
      this.todoService.remove(task._id)
        .subscribe(
          res => this.todos = this.todos.filter(todo => todo._id !=  res.json()['_id']),
          err => console.log(err),
          () => console.log('Todos deleted successfully')
        );
    }) 
  }
    
  ngOnInit() {
    this.todoService.loadAll()
      .subscribe(
        res => this.todos = res.json(),
        err => console.log(err),
        () => console.log('All todos loaded')
      );
  }
  
  // decorator version
  // onSubmit() {
  //   if (this.todo.title.length) {
  //     this.todo.completed = false;
  //     this.todoService.create(this.todo)
  //       .subscribe(
  //         res => this.todos.push(res),
  //         err => console.log(err),
  //         () => console.log('Todo added successfully')
  //       );
  //   }
  // }
  
  // toggleDone(event, todo) {
  //   todo.completed = !todo.completed;
  //   this.todoService.update(todo._id, {completed: todo.completed})
  //     .subscribe(
  //       res => res,
  //       err => console.log(err)
  //     );
  // }
  
  // clearCompleted() {
  //   let completedTasks: Array<Todo> = this.todos.filter(todo => todo.completed);
  //   completedTasks.forEach(task => {
  //     this.todoService.remove(task._id)
  //       .subscribe(
  //         res => this.todos = this.todos.filter(todo => todo._id !=  res['_id']),
  //         err => console.log(err),
  //         () => console.log('Todos deleted successfully')
  //       );
  //   }) 
  // }
  
  // ngOnInit() {
  //   this.todoService.loadAll()
  //     .subscribe(
  //       res => this.todos = res,
  //       err => console.log(err),
  //       () => console.log('All todos loaded')
  //     );
  // }
  
}