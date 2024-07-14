import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-base-customizable',
  standalone: true,
  imports: [],
  template: '',
  styles: ''
})
export class BaseCustomizableComponent {
  @Input() id?: string;
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
