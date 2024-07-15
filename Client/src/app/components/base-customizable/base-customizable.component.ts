import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, Renderer2 } from '@angular/core';
import { CustomizableModel, DomRectModel } from '../../model/customizable.model';
import { NewCRDTWSService } from '../../services/new-crdt-ws.service';

@Component({
  selector: 'app-base-customizable',
  standalone: true,
  imports: [],
  template: '',
  styles: '',
  // inputs: ['id', 'direction', 'width', 'type', 'name', 'lable'],
  // outputs: ['itemResized', 'itemDropped', 'itemRemoved' ] ,
})
export class BaseCustomizableComponent implements AfterViewInit, OnChanges {
  @Input({required: true}) id!: string;
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
  // ==================================================================================
  @Input({ required: true }) domRect!: DomRectModel;

  @Output() itemResized: EventEmitter<DomRectModel> = new EventEmitter<DomRectModel>();
  @Output() itemDropped: EventEmitter<DomRectModel> = new EventEmitter<DomRectModel>();
  @Output() itemRemoved: EventEmitter<DomRectModel> = new EventEmitter<DomRectModel>();
  previousSize: DomRectModel = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 };
  customizers: ElementRef<HTMLElement>[] = [];
  isResizing = false;
  isDragging = false;
  move!: 'vertical' | 'horizontal';
  start!: 'top' | 'bottom' | 'left' | 'right';
  mouseX!: number;
  mouseY!: number;
  pos1 = 0;
  pos2 = 0;
  pos3 = 0;
  pos4 = 0;
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    public crdtwsService: NewCRDTWSService<CustomizableModel>
  ) {
    this.renderer.addClass(elementRef.nativeElement, 'example-box');
  }

  @HostListener('mousedown', ['$event'])
  onDragMouseDown(event: any) {
    this.isDragging = true;
    event.preventDefault();
    // get the mouse cursor position at startup:
    this.pos3 = event.clientX;
    this.pos4 = event.clientY;
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
    this.isDragging = false;
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
  resizeOrDragDiv(e: MouseEvent) {
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
      this.setDimension();
      this.itemResized.emit(this.domRect);
      this.setResizePositions(e, this.move, this.start);
      this.setPreviousState();
    } else if (this.isDragging) {
      e.stopPropagation();
      e.preventDefault();
      // calculate the new cursor position:
      this.pos1 = this.pos3 - e.clientX;
      this.pos2 = this.pos4 - e.clientY;
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      // set the element's new position:
      // this.elementRef.nativeElement.style.top = (this.elementRef.nativeElement.offsetTop - this.pos2) + "px";
      // this.elementRef.nativeElement.style.left = (this.elementRef.nativeElement.offsetLeft - this.pos1) + "px";
      this.domRect.y = this.domRect.top = (this.elementRef.nativeElement.offsetTop - this.pos2);
      this.domRect.x = this.domRect.left = (this.elementRef.nativeElement.offsetLeft - this.pos1);
      this.renderer.setStyle(this.elementRef.nativeElement, 'top', this.domRect.top+ "px" );
      this.renderer.setStyle(this.elementRef.nativeElement, 'left', this.domRect.left+ "px" );
      // this.setPositionAndDimension();
      this.itemDropped.emit(this.domRect);
    }

  }

  ngAfterViewInit() {
    this.setDimension();
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

  setDimension() {
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
    this.setDimension();
  }
}
