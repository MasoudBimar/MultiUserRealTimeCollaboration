import { Component } from '@angular/core';
import { BaseCustomizableComponent } from '../base-customizable/base-customizable.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent extends BaseCustomizableComponent {

}
