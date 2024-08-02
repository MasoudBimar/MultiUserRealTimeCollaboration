import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CustomizableModel } from '../model/customizable.model';
import { Utility } from '../utility/utility';
@Component({
  selector: 'app-update-element-form',
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
  templateUrl: './update-element-form.component.html',
  styleUrl: './update-element-form.component.scss'
})
export class UpdateElementFormComponent implements OnInit {
  form?: FormGroup;
  componentList = Array.from(Utility.getComponentList().keys());
  constructor(
    public dialogRef: MatDialogRef<UpdateElementFormComponent>, @Inject(MAT_DIALOG_DATA) public data: CustomizableModel) {

  }
  ngOnInit(): void {
    this.form = this.crateConfigurationForm();
  }

  updateElementItem() {
    this.dialogRef.close(this.form?.value);
  }

  crateConfigurationForm(): FormGroup {
    return new FormGroup({
      'type': new FormControl(this.data.type),
      'name': new FormControl(this.data.name),
      'label': new FormControl(this.data.label),
      'placeholder': new FormControl(this.data.placeholder),
      'itemType': new FormControl({value: this.data.itemType, disabled: true}),
    });
  }
}
