import { CdkDrag } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { DomRectModel } from '../model/customizable.model';
@Directive({
  selector: '[customizable]',
  standalone: true,
  hostDirectives: [{ directive: CdkDrag, inputs: ['cdkDragBoundary'], outputs: ['cdkDragEnded'] }],
})
export class CustomizableDirective<T> implements AfterViewInit {
  previousSize: {
    left: number;
    top: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
  } = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
  customizers: ElementRef<HTMLElement>[] = [];
  isResizing: boolean = false;
  move!: 'vertical'| 'horizontal';
  start!: 'top' | 'bottom' | 'left' | 'right';
  mouseX!: number;
  mouseY!: number;
  prevDistance: number = 0;
  MIN_SIZE = 20;
  @Input() domRect?: DomRectModel;
  @Output('resizeEnd') sizeUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemDropped: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemResized: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemRemoved: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private _document: Document,
    private renderer: Renderer2
  ) {
    // this.renderer.setStyle(this.elementRef.nativeElement, 'background-color','#' + Math.floor(Math.random() * 16777215).toString(16));
  }

  @HostListener('cdkDragEnded', ['$event'])
  onDragEnded(ev: any) {
      if (this.domRect && ev.dropPoint) {
        let newX = this.domRect.x + ev.distance.x;
        let newY = this.domRect.y + ev.distance.y;
        this.domRect.x = this.domRect.left = newX;
        this.domRect.y = this.domRect.top = newY;
        this.itemDropped.emit(this.domRect);
        this.setPositionAndDimension();
      }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(ev: MouseEvent) {
    if (!this.isResizing) {
      this.customizers.forEach((single: ElementRef<HTMLElement>) => {
        this.renderer.removeChild(single.nativeElement.parentElement, single.nativeElement);
      });
      this.customizers = [];
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(ev: MouseEvent) {
    this.isResizing = false;
  }

  @HostListener('mouseenter', ['$event'])
  onMouseOver(ev: MouseEvent) {
    ev.stopPropagation();
    this.customizers.push(this.createResizers('ew-resize','horizontal', 'right'));
    this.customizers.push(this.createResizers('ns-resize', 'vertical', 'bottom'));
    this.customizers.push(this.createResizers('ew-resize', 'horizontal', 'left'));
    this.customizers.push(this.createResizers('ns-resize', 'vertical', 'top'));
    this.addRemoveHandler();
    this.customizers.forEach((single) => {
      this.renderer.appendChild(this.elementRef.nativeElement, single.nativeElement);
    });
  }

  createResizers(cursor: 'ew-resize'|'ns-resize', move: 'vertical'| 'horizontal', start: 'top' | 'bottom' | 'left' | 'right') {
    let resizerElement = this.renderer.createElement('div');
    this.renderer.addClass(resizerElement, 'resize-control');
    this.renderer.addClass(resizerElement, cursor);
    this.renderer.addClass(resizerElement, start);
    this.renderer.listen(resizerElement, 'mousedown', (e: MouseEvent) => {
      e.stopPropagation();
      this.setResizePositions(e, move, start);
      this.isResizing = true;
    })
    return new ElementRef(resizerElement);
  }

  setResizePositions(e: MouseEvent, move: 'vertical'| 'horizontal', start: 'top' | 'bottom' | 'left' | 'right') {
    this.move = move;
    this.start = start;
    this.isResizing = true;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  myFunc(updatedSize: any) {
    updatedSize.x = updatedSize.left;
    updatedSize.y = updatedSize.top;
    if (this.domRect) {
      this.domRect = { ...updatedSize };
    }
    this.setPositionAndDimension();
  }

  @HostListener('window:mousemove', ['$event'])
  resizeDiv(e: any) {
    if (this.isResizing) {
      e.stopPropagation();
      this.setPreviousState();
      if (this.move === 'vertical') {
        if (this.start === 'top') {
          let dist = e.clientY - this.mouseY;
          let updatedSize = { ... this.previousSize, height: this.previousSize.height - dist, top: this.previousSize.top + dist } as DOMRect;
          this.myFunc(updatedSize);
          this.sizeUpdated.emit(this.domRect);
          this.setResizePositions(e, this.move, this.start);
        } else {
          let dist = e.clientY - this.mouseY;
          let updatedSize = { ... this.previousSize, height: this.previousSize.height + dist, bottom: this.previousSize.bottom + dist } as DOMRect;
          this.myFunc(updatedSize);
          this.sizeUpdated.emit(this.domRect);
          this.setResizePositions(e, this.move, this.start);
        }
      } else {
        let dist = e.clientX - this.mouseX;
        if (this.start === 'left') {
          let updatedSize = {
            bottom: this.previousSize.bottom,
            top: this.previousSize.top,
            height: this.previousSize.height,
            right: this.previousSize.right,
            left:
              this.previousSize.left + dist > 0
                ? this.previousSize.left + dist
                : this.previousSize.left,
            width:
              this.previousSize.left + dist > 0
                ? this.previousSize.width - dist
                : this.previousSize.width,
          } as DOMRect;
          this.myFunc(updatedSize);
          this.sizeUpdated.emit(this.domRect);
          this.setResizePositions(e, this.move, this.start);
        } else {
          let updatedSize = {
            bottom: this.previousSize.bottom,
            top: this.previousSize.top,
            height: this.previousSize.height,
            left: this.previousSize.left,
            right: this.previousSize.right + dist,
            width: this.previousSize.width + dist,
          } as DOMRect;
          this.myFunc(updatedSize);
          this.sizeUpdated.emit(this.domRect);
          this.setResizePositions(e, this.move, this.start);
        }
      }
      this.setPreviousState();
    }
  }

  ngAfterViewInit() {
    this.setPositionAndDimension();
    this.setPreviousState();
  }

  setPreviousState() {
    const element = this.elementRef.nativeElement;
    this.previousSize.width = element.offsetWidth;
    this.previousSize.height = element.offsetHeight;
    const values = element.style.transform?.split(/\w+\(|\);?/);
    const transform = values[1]
      ?.split(/,\s?/g)
      .map((numStr: any) => parseInt(numStr));
    let result = { x: 0, y: 0, z: 0 };
    if (transform)
      result = {
        x: transform[0],
        y: transform[1],
        z: transform[2],
      };
    this.previousSize.left = result.x;
    this.previousSize.top = result.y;
    this.previousSize.right = result.x + this.previousSize.width;
    this.previousSize.bottom = result.y + this.previousSize.height;

    return result;
  }

  setPositionAndDimension() {
    if (this.domRect) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${this.domRect.height}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${this.domRect.width}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'transform', 'translate3d(' + this.domRect.left + 'px,' + this.domRect.top + 'px, 0px )');
    }
  }

  addRemoveHandler() {
    let removeHandlerElement = this.renderer.createElement('div');
    this.renderer.addClass(removeHandlerElement, 'remove-handler');
    let removeIconElement = this.renderer.createElement('div');
    this.renderer.addClass(removeIconElement, 'remove');
    this.renderer.addClass(removeIconElement, 'icon');
    this.renderer.listen(removeIconElement, 'click', (event: any) => {
      this.itemRemoved.emit({});
    });
    this.renderer.appendChild(removeHandlerElement, removeIconElement);
    this.renderer.appendChild(this.elementRef.nativeElement, removeHandlerElement);
    this.customizers.push(new ElementRef(removeHandlerElement));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setPositionAndDimension();
  }
}
