import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
export interface DialogData {
  toDoItem: FormGroup;
}
@Component({
  selector: 'app-todo-item-form',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    CommonModule,
    MatDialogActions,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './todo-item-form.component.html',
  styleUrl: './todo-item-form.component.scss'
})
export class TodoItemFormComponent implements OnInit {
  form?: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<TodoItemFormComponent>,) {

  }
  ngOnInit(): void {
    this.form = this.data.toDoItem;
  }

  addToDoItem() {
  console.log("🚀 ~ TodoItemFormComponent ~ addToDoItem ~ a:")

    this.dialogRef.close(this.form?.value);
  }
}
