import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '../card/card.component';
import { CustomizableDirective } from '../directives/customizable.directive';
import { ToDoItem } from '../model/card.model';


@Component({
  selector: 'app-drag',
  standalone: true,
  imports: [CdkDrag, CustomizableDirective, CommonModule, MatCardModule, MatButtonModule, CardComponent, MatIconModule],
  templateUrl: './drag.component.html',
  styleUrl: './drag.component.scss',
})
export class DragComponent implements OnInit {
  @Input() model?: ToDoItem;
  @Input() index?: number;
  @Input() boundary: string = '';
  @Output() itemDropped: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemResized: EventEmitter<any> = new EventEmitter<any>();
  // @Output() itemRemoved: EventEmitter<any> = new EventEmitter<any>();


  constructor(private elementRef: ElementRef) {
  }
  ngOnInit(): void {
  }
  updateSize(ev: any) {
    ev.x = ev.left;
    ev.y = ev.top;
    if (this.model) {
      this.model.domRect = { ...ev };
    }
    this.itemResized.emit({ ...ev, index: this.index });
  }
  dropped(ev: any) {
    if (this.model?.domRect && ev.dropPoint) {
      let newX = this.model.domRect.x + ev.distance.x;
      let newY = this.model.domRect.y + ev.distance.y;
      this.model.domRect.x = this.model.domRect.left = newX;
      this.model.domRect.y = this.model.domRect.top = newY;
    }
    this.itemDropped.emit({ ...ev, index: this.index });
  }

  // removed() {
  //   this.itemRemoved.emit({ index: this.index });
  // }
}
