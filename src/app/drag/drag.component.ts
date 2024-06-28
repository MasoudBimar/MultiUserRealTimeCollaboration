import { CommonModule } from '@angular/common';
import { AfterRenderPhase, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, afterNextRender } from '@angular/core';
import { ResizeDirective } from '../directives/resize.directive';
import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CardComponent } from '../card/card.component';
import { DomRectModel, ToDoItem } from '../model/card.model';
import { MatIconModule } from '@angular/material/icon';
import { Utility } from '../utility/utility';


@Component({
  selector: 'app-drag',
  standalone: true,
  imports: [CdkDrag, ResizeDirective, CommonModule, MatCardModule, MatButtonModule, CardComponent, MatIconModule],
  templateUrl: './drag.component.html',
  styleUrl: './drag.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragComponent implements OnInit {
  // @ViewChild('example') example?: ElementRef<HTMLElement>;
  @Input() model?: ToDoItem;
  @Input() index?: number;
  @Input() boundary: string = '';
  @Output() itemDropped: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemResized: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemRemoved: EventEmitter<any> = new EventEmitter<any>();
  // domRect?: DOMRect;
  extraX = 32;
  extraY = 32;
  /**
   *
   */
  constructor(private elementRef: ElementRef ) {
    // Use the `Read` phase to read geometric properties after all writes have occurred.
    afterNextRender(() => {
      if (this.model && !this.model.domRect) {
        this.model.domRect = elementRef.nativeElement.getBoundingClientRect();
      }
    }, {phase: AfterRenderPhase.Read});
  }
  ngOnInit(): void {
  }
  updateSize(ev: DOMRect) {
    if (this.model) {
      this.model.domRect = { ...ev };
    }
    this.itemResized.emit({...ev, index: this.index});
  }
  dropped(ev: any) {
    if (this.model?.domRect && ev.dropPoint) {
      this.model.domRect.x = ev.dropPoint.x;
      this.model.domRect.y = ev.dropPoint.y;
    }
    this.itemDropped.emit({...ev, index: this.index});
  }

  removed() {
    this.itemRemoved.emit({ index: this.index});
  }
}
