import { Component } from '@angular/core';
import { CustomizableDirective } from '../../directives/customizable.directive';
import { BaseCustomizableComponent } from '../base-customizable/base-customizable.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  hostDirectives:[{directive: CustomizableDirective, inputs:['domRect', 'id'], outputs:['itemResized','itemDropped', 'itemRemoved']}]
})
export class InputComponent extends BaseCustomizableComponent {

}
