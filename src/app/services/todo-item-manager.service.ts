//web-socket.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, filter } from 'rxjs';
import { ToDoItem } from '../model/customizable.model';
@Injectable({
  providedIn: 'root',
})
export class TodoItemManagerService {

  todoItemList: ToDoItem[]= [];
  // todoItemList: BehaviorSubject<ToDoItem[]> = new BehaviorSubject<ToDoItem[]>([]);
  // todoItems$: Observable<ToDoItem[]>=this.todoItems.asObservable();

  /**
   *
   */
  constructor() {

  }

  addTodoItem(newItem: ToDoItem){
    this.toDoItems.push(newItem);
  }

  createTodoItem(title: string, body: string){
    let newItem = new ToDoItem(title, body);
    this.addTodoItem(newItem)
  }

  get toDoItems() {
    return this.todoItemList.filter((item: ToDoItem) => item.status === 'todo');
  }

  get doingItems() {
    return this.todoItemList.filter(item => item.status === 'doing');
  }

  get doneItems() {
    return this.todoItemList.filter(item => item.status === 'done');
  }
}
