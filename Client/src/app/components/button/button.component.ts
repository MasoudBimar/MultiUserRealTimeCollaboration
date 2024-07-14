import { Component } from '@angular/core';
import { CustomizableDirective } from '../../directives/customizable.directive';
import { BaseCustomizableComponent } from '../base-customizable/base-customizable.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  hostDirectives:[{directive: CustomizableDirective, inputs:['domRect', 'id'], outputs:['itemResized','itemDropped', 'itemRemoved']}]
})
export class ButtonComponent extends BaseCustomizableComponent {

}
