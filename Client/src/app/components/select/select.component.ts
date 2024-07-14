import { Component, OnInit } from '@angular/core';
import { CustomizableDirective } from '../../directives/customizable.directive';
import { BaseCustomizableComponent } from '../base-customizable/base-customizable.component';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  hostDirectives:[{directive: CustomizableDirective, inputs:['domRect', 'id'], outputs:['itemResized','itemDropped', 'itemRemoved']}]
})
export class SelectComponent extends BaseCustomizableComponent implements OnInit {

  ngOnInit(): void {
    console.log('##############################')
  }
}
