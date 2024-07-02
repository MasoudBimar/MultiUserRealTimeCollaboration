import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { debounce, interval, Subject } from 'rxjs';
import { CardComponent } from './card/card.component';
import { CustomizableDirective } from './directives/customizable.directive';
import { CustomizableModel, ToDoItem } from './model/customizable.model';
import { CRDTService } from './services/crdt.service';
import { SnackBarService } from './services/snackbar.service';
import { TodoItemManagerService } from './services/todo-item-manager.service';
import { TodoItemFormComponent } from './todo-item-form/todo-item-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CustomizableDirective,MatInputModule, CommonModule, MatButtonModule, CardComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DragAndDrop';
  newToDoItemForm: FormGroup;
  itemResized$: Subject<any> = new Subject<any>();
  itemDropped$: Subject<any> = new Subject<any>();
  toDoItemList: ToDoItem[] = [];
  constructor(public dialog: MatDialog,public snackBarService: SnackBarService, private todoItemManagerService: TodoItemManagerService,public crdtService: CRDTService<ToDoItem>) {
    this.newToDoItemForm = this.creatTodoForm();
    this.itemResized$.pipe( debounce(i => interval(100))).subscribe((event:any) => {
      this.crdtService.updateItem(event.index, event.domRect );
    });

    this.itemDropped$.subscribe((event: any) => {
        this.crdtService.updateItem(event.index, event.event );
    });
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
        let newItem = new CustomizableModel<ToDoItem>();
        newItem.metaData= new ToDoItem( response.title, response.body);
          this.crdtService.insert(newItem);
          this.snackBarService.openSuccess('ToDo Item Created', 'Ok');
      } else{
        this.snackBarService.openError('Operation Failed', 'Ok');
      }
    });
  }

  connect(){
    this.crdtService.connect();
  }

  clearBorad(){
    this.crdtService.clear();
  }

  deleteItem(idx: number){
    this.crdtService.delete(idx);
  }
}
