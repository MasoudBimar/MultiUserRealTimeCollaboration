import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  Output,
  Renderer2
} from '@angular/core';
import { DomRectModel } from '../model/customizable.model';
@Directive({
  selector: '[appCustomizable]',
  standalone: true,
  hostDirectives: [{ directive: CdkDrag, inputs: ['cdkDragBoundary'], outputs: ['cdkDragEnded'] }],
})
export class CustomizableDirective implements AfterViewInit, OnChanges {
  previousSize: DomRectModel = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 };
  customizers: ElementRef<HTMLElement>[] = [];
  isResizing = false;
  move!: 'vertical' | 'horizontal';
  start!: 'top' | 'bottom' | 'left' | 'right';
  mouseX!: number;
  mouseY!: number;
  prevDistance = 0;
  MIN_SIZE = 20;
  @Input() domRect?: DomRectModel;
  @Output() itemResized: EventEmitter<DomRectModel> = new EventEmitter<DomRectModel>();
  @Output() itemDropped: EventEmitter<DomRectModel> = new EventEmitter<DomRectModel>();
  @Output() itemRemoved: EventEmitter<DomRectModel> = new EventEmitter<DomRectModel>();
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private _document: Document,
    private renderer: Renderer2
  ) { }

  @HostListener('cdkDragEnded', ['$event'])
  onDragEnded(dragEndedEvent: CdkDragEnd) {
    if (this.domRect && dragEndedEvent.dropPoint) {
      const newX = this.domRect.x + dragEndedEvent.distance.x;
      const newY = this.domRect.y + dragEndedEvent.distance.y;
      this.domRect.x = this.domRect.left = newX;
      this.domRect.y = this.domRect.top = newY;
      this.itemDropped.emit(this.domRect);
      this.setPositionAndDimension();
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave() {
    if (!this.isResizing) {
      this.customizers.forEach((single: ElementRef<HTMLElement>) => {
        this.renderer.removeChild(single.nativeElement.parentElement, single.nativeElement);
      });
      this.customizers = [];
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp() {
    this.isResizing = false;
  }

  @HostListener('mouseenter', ['$event'])
  onMouseOver(event: MouseEvent) {
    event.stopPropagation();
    this.customizers.push(this.createResizers('ew-resize', 'horizontal', 'right'));
    this.customizers.push(this.createResizers('ns-resize', 'vertical', 'bottom'));
    this.customizers.push(this.createResizers('ew-resize', 'horizontal', 'left'));
    this.customizers.push(this.createResizers('ns-resize', 'vertical', 'top'));
    this.addRemoveHandler();
    this.customizers.forEach((single) => {
      this.renderer.appendChild(this.elementRef.nativeElement, single.nativeElement);
    });
  }

  createResizers(cursor: 'ew-resize' | 'ns-resize', move: 'vertical' | 'horizontal', start: 'top' | 'bottom' | 'left' | 'right') {
    const resizerElement = this.renderer.createElement('div');
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

  setResizePositions(e: MouseEvent, move: 'vertical' | 'horizontal', start: 'top' | 'bottom' | 'left' | 'right') {
    this.move = move;
    this.start = start;
    this.isResizing = true;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  @HostListener('window:mousemove', ['$event'])
  resizeDiv(e: MouseEvent) {
    if (this.isResizing) {
      e.stopPropagation();
      this.setPreviousState();
      const updatedSize: DomRectModel = this.previousSize as DomRectModel;
      let dist: number;
      let dimension: 'height' | 'width';
      if (this.move === 'vertical') {
        dist = e.clientY - this.mouseY;
        dimension = 'height';

      } else {
        dist = e.clientX - this.mouseX;
        dimension = 'width';
      }
      updatedSize[dimension] = (this.start === 'left' || this.start === 'top') ? this.previousSize[dimension] - dist : this.previousSize[dimension] + dist;
      updatedSize[this.start] = this.previousSize[this.start] + dist;
      updatedSize.x = updatedSize.left;
      updatedSize.y = updatedSize.top;
      this.domRect = { ...updatedSize };
      this.setPositionAndDimension();
      this.itemResized.emit(this.domRect);
      this.setResizePositions(e, this.move, this.start);
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
    const transform = values[1]?.split(/,\s?/g).map((numStr: string) => parseInt(numStr));
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
    const removeHandlerElement = this.renderer.createElement('div');
    this.renderer.addClass(removeHandlerElement, 'remove-handler');
    const removeIconElement = this.renderer.createElement('div');
    this.renderer.addClass(removeIconElement, 'remove');
    this.renderer.addClass(removeIconElement, 'icon');
    this.renderer.listen(removeIconElement, 'click', () => {
      this.itemRemoved.emit();
    });
    this.renderer.appendChild(removeHandlerElement, removeIconElement);
    this.renderer.appendChild(this.elementRef.nativeElement, removeHandlerElement);
    this.customizers.push(new ElementRef(removeHandlerElement));
  }

  ngOnChanges() {
    this.setPositionAndDimension();
  }
}
