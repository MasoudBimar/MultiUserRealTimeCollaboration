import { CdkDrag } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  AfterViewInit,
  HostListener,
  Output,
  EventEmitter,
  Inject,
  Renderer2,
  Input,
  SimpleChanges,
} from '@angular/core';
import { CustomizableModel, DomRectModel } from '../model/customizable.model';
import { MovingDirectionEnum } from '../enums/moving-direction.enum';
import { ResizingDirectionEnum } from '../enums/resizing-direction.enum';
import { CursorTypeEnum } from '../enums/cursor-type.enum';
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
  move!: MovingDirectionEnum;
  start!: ResizingDirectionEnum;
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
    this.customizers.push(this.createResizers(CursorTypeEnum.SIDE, MovingDirectionEnum.HORIZONTAL, ResizingDirectionEnum.RIGHT));
    this.customizers.push(this.createResizers(CursorTypeEnum.UPDOWN, MovingDirectionEnum.VERTICAL, ResizingDirectionEnum.BOTTOM));
    this.customizers.push(this.createResizers(CursorTypeEnum.SIDE, MovingDirectionEnum.HORIZONTAL, ResizingDirectionEnum.LEFT));
    this.customizers.push(this.createResizers(CursorTypeEnum.UPDOWN, MovingDirectionEnum.VERTICAL, ResizingDirectionEnum.TOP));
    this.addRemoveHandler();
    this.customizers.forEach((single) => {
      this.renderer.appendChild(this.elementRef.nativeElement, single.nativeElement);
    });
  }

  createResizers(cursor: CursorTypeEnum, move: MovingDirectionEnum, start: ResizingDirectionEnum) {
    let resizerElement = this.renderer.createElement('div');
    this.renderer.setStyle(resizerElement, 'position', 'absolute');
    if (cursor === CursorTypeEnum.SIDE && start === ResizingDirectionEnum.RIGHT) {
      this.renderer.setStyle(resizerElement, 'top', '50%');
      this.renderer.setStyle(resizerElement, 'left', '100%');
    } else if (cursor === CursorTypeEnum.UPDOWN && start === ResizingDirectionEnum.BOTTOM) {
      this.renderer.setStyle(resizerElement, 'top', '100%');
      this.renderer.setStyle(resizerElement, 'left', '50%');

    } else if (cursor === CursorTypeEnum.SIDE && start === ResizingDirectionEnum.LEFT) {
      this.renderer.setStyle(resizerElement, 'top', '50%');
      this.renderer.setStyle(resizerElement, 'left', '0');

    } else if (cursor === CursorTypeEnum.UPDOWN && start === ResizingDirectionEnum.TOP) {
      this.renderer.setStyle(resizerElement, 'top', '0');
      this.renderer.setStyle(resizerElement, 'left', '50%');

    }
    this.renderer.setStyle(resizerElement, 'cursor', cursor);
    this.renderer.setStyle(resizerElement, 'width', '15px');
    this.renderer.setStyle(resizerElement, 'height', '15px');
    this.renderer.setStyle(resizerElement, 'background', 'red');
    this.renderer.setStyle(resizerElement, 'transform', 'translate(-50%,-50%)');
    this.renderer.listen(resizerElement, 'mousedown', (e: MouseEvent) => {
      e.stopPropagation();
      this.setResizePositions(e, move, start);
      this.isResizing = true;
    })
    return new ElementRef(resizerElement);
  }

  setResizePositions(e: MouseEvent, move: MovingDirectionEnum, start: ResizingDirectionEnum) {
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
      if (this.move === MovingDirectionEnum.VERTICAL) {
        if (this.start === ResizingDirectionEnum.TOP) {
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
        if (this.start === ResizingDirectionEnum.LEFT) {
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
