import { Component } from '@angular/core';
import { BaseCustomizableComponent } from '../base-customizable/base-customizable.component';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [MatRadioModule],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
})
export class RadioComponent extends BaseCustomizableComponent {

}
