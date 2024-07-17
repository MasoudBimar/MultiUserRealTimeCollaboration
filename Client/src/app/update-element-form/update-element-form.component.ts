import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Utility } from '../utility/utility';
import { CustomizableModel } from '../model/customizable.model';
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
      'type': new FormControl(this.data.type, [Validators.required]),
      'name': new FormControl(this.data.name, [Validators.required]),
      'label': new FormControl(this.data.label, [Validators.required]),
      'placeholder': new FormControl(this.data.placeholder, [Validators.required]),
      'itemType': new FormControl(this.data.itemType, [Validators.required]),
    });
  }
}
