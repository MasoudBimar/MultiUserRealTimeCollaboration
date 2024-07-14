import { Component } from '@angular/core';
import { CustomizableDirective } from '../../directives/customizable.directive';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  hostDirectives:[{directive: CustomizableDirective, inputs:['domRect', 'id'], outputs:['itemResized','itemDropped', 'itemRemoved']}]
})
export class CheckboxComponent {

}
