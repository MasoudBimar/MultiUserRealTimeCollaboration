import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MetaData } from '../model/customizable.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  // @Input() model?: MetaData;
  @Input() direction: "ltr" | "rtl" = 'ltr';
  @Input() width: string = '250px';
  @Input() type: 'text' | 'number' = 'text';
  @Input() name: string = 'name';
  @Input() label: string = 'label';
  @Input() placeholder: string = 'something';
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() labelPosition: "default" | "start" | "top" = 'top';
  @Input() disabled: boolean = false;
  @Input() value: any = 'test';

}
