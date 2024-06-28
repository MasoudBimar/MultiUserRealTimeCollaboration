import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragComponent } from './drag/drag.component';
import { ToDoItem } from './model/card.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TodoItemFormComponent } from './todo-item-form/todo-item-form.component';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from './services/snackbar.service';
import { TodoItemManagerService } from './services/todo-item-manager.service';
import { CRDTService } from './services/crdt.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DragComponent, CommonModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DragAndDrop';
  newToDoItemForm: FormGroup;
  toDoItemList: ToDoItem[] = [];
  constructor(public dialog: MatDialog,public snackBarService: SnackBarService, private todoItemManagerService: TodoItemManagerService,public crdtService: CRDTService) {
    this.newToDoItemForm = this.creatTodoForm();
  }
  private creatTodoForm(): FormGroup<any> {
    return new FormGroup({
      'title': new FormControl('', [Validators.required]),
      'body': new FormControl('', [Validators.required]),
    });
  }

  addToDoItem() {
    this.newToDoItemForm = this.creatTodoForm();
    let dialogRef = this.dialog.open(TodoItemFormComponent, {
      data: {toDoItem:this.newToDoItemForm},
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
          this.crdtService.insert(new ToDoItem(response.title, response.body));
          this.snackBarService.openSuccess('ToDo Item Created', 'Ok');
      } else{
        this.snackBarService.openError('Operation Failed', 'Ok');
      }
    });
  }

  itemDropped(event: any, model: ToDoItem) { //CdkDragDrop<any>
    console.log("🚀 ~ AppComponent ~ itemDropped ~ event:", event);
    console.log(this.crdtService.array);
    // this.crdtService.updateItem(event.index, model );
  }

  itemResized(event: any, model: ToDoItem) { //CdkDragDrop<any>
    console.log("🚀 ~ AppComponent ~ itemDropped ~ event:", event);
    console.log(this.crdtService.array);
    // setTimeout(() => {
    //   this.crdtService.updateItem(event.index, model );
    // }, 5000);
  }

  connect(){
    this.crdtService.connect();
  }

  clearBorad(){
    this.crdtService.clear();
  }

  delete(idx: number){
    this.crdtService.delete(idx);
  }

  // get todoItems():ToDoItem[]{
  //   console.log("🚀 ~ AppComponent ~ gettodoItems ~ array:", this.crdtService.yarray?.toArray())
  //   if (this.crdtService.yarray) {
  //     let array= this.crdtService.yarray.toArray();
  //     return array.map(x=> JSON.parse(x));
  //   } else {
  //     return [];
  //   }
  // }
}
