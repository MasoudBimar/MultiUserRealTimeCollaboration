import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-add-element-form',
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
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './add-element-form.component.html',
  styleUrl: './add-element-form.component.scss'
})
export class AddElementFormComponent implements OnInit {
  form?: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddElementFormComponent>,) {

  }
  ngOnInit(): void {
    this.form = this.creatTodoForm();
  }

  addElementItem() {
    this.dialogRef.close(this.form?.value);
  }

  creatTodoForm(): FormGroup {
    return new FormGroup({
      'label': new FormControl('', [Validators.required]),
      // 'lable': new FormControl('', [Validators.required]),
      'itemType': new FormControl('', [Validators.required]),
      // 'lable': new FormControl('', [Validators.required]),
    });
  }
}