import { Component } from '@angular/core';
import { BaseCustomizableComponent } from '@app-components';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [MatCheckboxModule, FormsModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent extends BaseCustomizableComponent {

}
