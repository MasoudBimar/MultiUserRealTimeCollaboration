import { Component } from '@angular/core';
import { BaseCustomizableComponent } from '../base-customizable/base-customizable.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent extends BaseCustomizableComponent {

}
