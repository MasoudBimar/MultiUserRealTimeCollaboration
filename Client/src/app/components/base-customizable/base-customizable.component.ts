import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, Renderer2 } from '@angular/core';
import { DomRectModel } from '../../model/customizable.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[appCustomizable]',
  standalone: true,
  imports: [],
  template: '',
  styles: '',
})
export class BaseCustomizableComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) id!: string;
  @Input() type: 'text' | 'number' = 'text';
  @Input() name: string = 'name';
  @Input() label: string = 'label';
  @Input() placeholder: string = 'something';
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() labelPosition: "default" | "start" | "top" = 'top';
  @Input() disabled: boolean = false;
  @Input() value: any = 'test';
  @Input() itemType: string = 'input';
  @Input({ required: true }) domRect!: DomRectModel;
  @Input() textContent = 'text';

  @Output() itemResized: EventEmitter<DomRectModel> = new EventEmitter<DomRectModel>();
  @Output() itemDropped: EventEmitter<DomRectModel> = new EventEmitter<DomRectModel>();
  @Output() itemRemoved: EventEmitter<void> = new EventEmitter<void>();
  @Output() itemSetting: EventEmitter<string> = new EventEmitter<string>();
  previousSize: DomRectModel= { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 };
  customizers: ElementRef<HTMLElement>[] = [];
  isResizing = false;
  isDragging = false;
  resizeDirection!: 'vertical' | 'horizontal';
  resizeSide!: 'top' | 'bottom' | 'left' | 'right';
  prevCursorPosition: { mouseX: number; mouseY: number } = { mouseX: 0, mouseY: 0 };
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {
    this.renderer.addClass(elementRef.nativeElement, 'cusomizable-box');
  }

  @HostListener('mousedown', ['$event'])
  onDragMouseDown(event: any) {
    event.preventDefault();
    this.setPreviousCursorPosition(event);
    this.isDragging = true;
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
    this.addSettingHandler();
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
    this.resizeDirection = move;
    this.resizeSide = start;
    this.isResizing = true;
    this.prevCursorPosition = { mouseX: e.clientX, mouseY: e.clientY };
  }

  setPreviousCursorPosition(event: MouseEvent) {
    this.prevCursorPosition = { mouseX: event.clientX, mouseY: event.clientY };
  }

  @HostListener('window:mousemove', ['$event'])
  resizeOrDragDiv(e: MouseEvent) {

    if (this.isResizing) {
      e.stopPropagation();
      this.setPreviousState();
      let dist: number;
      let dimension: 'height' | 'width';
      if (this.resizeDirection === 'vertical') {
        dist = e.clientY - this.prevCursorPosition.mouseY;
        dimension = 'height';

      } else {
        dist = e.clientX - this.prevCursorPosition.mouseX;
        dimension = 'width';
      }
      this.domRect[dimension] = (this.resizeSide === 'left' || this.resizeSide === 'top') ? this.previousSize[dimension] - dist : this.previousSize[dimension] + dist;
      this.domRect[this.resizeSide] = this.previousSize[this.resizeSide] + dist;
      this.domRect.x = this.domRect.left;
      this.domRect.y = this.domRect.top;

      this.setDimension();
      this.itemResized.emit(this.domRect);
      this.setResizePositions(e, this.resizeDirection, this.resizeSide);
      this.setPreviousState();

    } else if (this.isDragging) {
      e.stopPropagation();
      e.preventDefault();
      const dx = e.clientX - this.prevCursorPosition.mouseX;
      const dy = e.clientY - this.prevCursorPosition.mouseY;

      this.domRect.top = (this.elementRef.nativeElement.offsetTop + dy);
      this.domRect.y = this.domRect.top;
      this.domRect.left = (this.elementRef.nativeElement.offsetLeft + dx);
      this.domRect.x = this.domRect.left;
      this.setPreviousCursorPosition(e);
      this.setDimension();
      this.itemDropped.emit(this.domRect);
      this.setPreviousState();
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
    this.previousSize.left = element.offsetLeft;
    this.previousSize.top = element.offsetTop;
    this.previousSize.right = this.previousSize.left + this.previousSize.width;
    this.previousSize.bottom = this.previousSize.top + this.previousSize.height;
  }

  setDimension() {
    if (this.domRect) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${this.domRect.height}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${this.domRect.width}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'top', this.domRect.top + "px");
      this.renderer.setStyle(this.elementRef.nativeElement, 'left', this.domRect.left + "px");
      this.renderer.setStyle(this.elementRef.nativeElement, 'y', this.domRect.top + "px");
      this.renderer.setStyle(this.elementRef.nativeElement, 'x', this.domRect.left + "px");
    }
  }

  addRemoveHandler() {
    const removeHandlerElement = this.renderer.createElement('div');
    this.renderer.addClass(removeHandlerElement, 'remove-handler');
    const removeIconElement = this.renderer.createElement('i');
    this.renderer.addClass(removeIconElement, 'material-icons');
    this.renderer.setProperty(removeIconElement, 'textContent', 'delete');
    this.renderer.listen(removeHandlerElement, 'click', () => {
      this.itemRemoved.emit();
    });
    this.renderer.appendChild(removeHandlerElement, removeIconElement);
    this.renderer.appendChild(this.elementRef.nativeElement, removeHandlerElement);
    this.customizers.push(new ElementRef(removeHandlerElement));
  }

  addSettingHandler() {
    const settingHandlerElement = this.renderer.createElement('div');
    this.renderer.addClass(settingHandlerElement, 'setting-handler');
    const settingIconElement = this.renderer.createElement('i');
    this.renderer.addClass(settingIconElement, 'material-icons');
    this.renderer.setProperty(settingIconElement, 'textContent', 'settings');
    this.renderer.listen(settingHandlerElement, 'click', () => {
      this.itemSetting.emit();
    });
    this.renderer.appendChild(settingHandlerElement, settingIconElement);
    this.renderer.appendChild(this.elementRef.nativeElement, settingHandlerElement);
    this.customizers.push(new ElementRef(settingHandlerElement));
  }

  ngOnChanges() {
    this.setDimension();
  }
}
