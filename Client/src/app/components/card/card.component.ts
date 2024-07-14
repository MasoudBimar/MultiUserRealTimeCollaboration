import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CustomizableDirective } from '../../directives/customizable.directive';
import { BaseCustomizableComponent } from '../base-customizable/base-customizable.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  hostDirectives:[{directive: CustomizableDirective, inputs:['domRect', 'id'], outputs:['itemResized','itemDropped', 'itemRemoved']}]
})
export class CardComponent extends BaseCustomizableComponent {


}
