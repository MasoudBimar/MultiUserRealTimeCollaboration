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
} from '@angular/core';

const enum CursorTypeEnum {
  SIDE = 'ew-resize',
  UPDOWN = 'ns-resize',
}

const enum MoveDirectioneEnum {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

const enum StartResizeEnum {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

// The Renderer2 class is an abstraction provided by Angular in the form of a service
// that allows to manipulate elements of your app without having to touch the DOM directly.
// This is the recommended approach because it then makes it easier to develop apps that can be rendered in environments
// that don’t have DOM access, like on the server, in a web worker or on native mobile.

@Directive({
  selector: '[resize]',
  standalone: true,
})
export class ResizeDirective implements AfterViewInit {
  previousSize: {
    left: number;
    top: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
  } = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
  resizers: ElementRef<HTMLElement>[] = [];
  isResizing: boolean = false;
  move!: MoveDirectioneEnum;
  start!: StartResizeEnum;
  mouseX!: number;
  mouseY!: number;
  prevDistance: number = 0;
  MIN_SIZE = 20;
  @Output('resizeEnd') sizeUpdated = new EventEmitter<DOMRect>();

  constructor(
    private ele: ElementRef,
    @Inject(DOCUMENT) private _document: Document,
    private renderer: Renderer2
  ) {
   }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(ev: MouseEvent) {
    if (!this.isResizing) {
      this.resizers.forEach((single: ElementRef<HTMLElement>) => {
        this.renderer.removeChild(single.nativeElement.parentElement, single.nativeElement);
      });
      this.resizers = [];
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(ev: MouseEvent) {
    this.isResizing = false;
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(ev: MouseEvent) {
    ev.stopPropagation();
    // this.previousSize = this.ele.nativeElement.getBoundingClientRect();
    this.resizers.push(new ElementRef(this.createResizers(CursorTypeEnum.SIDE, MoveDirectioneEnum.HORIZONTAL, StartResizeEnum.RIGHT)));
    this.resizers.push(new ElementRef(this.createResizers(CursorTypeEnum.UPDOWN, MoveDirectioneEnum.VERTICAL, StartResizeEnum.BOTTOM)));
    this.resizers.push(new ElementRef(this.createResizers(CursorTypeEnum.SIDE, MoveDirectioneEnum.HORIZONTAL, StartResizeEnum.LEFT)));
    this.resizers.push(new ElementRef(this.createResizers(CursorTypeEnum.UPDOWN, MoveDirectioneEnum.VERTICAL, StartResizeEnum.TOP)));
    this.resizers.forEach((single) => {
      this.renderer.appendChild(this.ele.nativeElement,single.nativeElement);
      // this.ele.nativeElement.appendChild(single.nativeElement);
    });
  }

  createResizers(cursor: CursorTypeEnum, move: MoveDirectioneEnum, start: StartResizeEnum) {
    let resizerElement = this.renderer.createElement('div');
    this.renderer.setStyle(resizerElement, 'position', 'absolute');
    if (cursor === CursorTypeEnum.SIDE && start === StartResizeEnum.RIGHT) {
      this.renderer.setStyle(resizerElement, 'top', '50%');
      this.renderer.setStyle(resizerElement, 'left', '100%');
    } else if (cursor === CursorTypeEnum.UPDOWN && start === StartResizeEnum.BOTTOM) {
      this.renderer.setStyle(resizerElement, 'top', '100%');
      this.renderer.setStyle(resizerElement, 'left', '50%');

    } else if (cursor === CursorTypeEnum.SIDE && start === StartResizeEnum.LEFT) {
      this.renderer.setStyle(resizerElement, 'top', '50%');
      this.renderer.setStyle(resizerElement, 'left', '0');

    } else if (cursor === CursorTypeEnum.UPDOWN && start === StartResizeEnum.TOP) {
      this.renderer.setStyle(resizerElement, 'top', '0');
      this.renderer.setStyle(resizerElement, 'left', '50%');

    }
    this.renderer.setStyle(resizerElement, 'cursor', cursor);
    this.renderer.setStyle(resizerElement, 'width', '15px');
    this.renderer.setStyle(resizerElement, 'height', '15px');
    this.renderer.setStyle(resizerElement, 'background', 'red');
    this.renderer.setStyle(resizerElement, 'transform', 'translate(-50%,-50%)');
    this.renderer.listen(resizerElement , 'mousedown' , (e: MouseEvent) => {
      e.stopPropagation();
      this.setResizePositions(e, move, start);
      this.isResizing = true;
    } )
    return resizerElement;
  }

  setResizePositions(e: MouseEvent, move: MoveDirectioneEnum, start: StartResizeEnum) {
    this.move = move;
    this.start = start;
    this.isResizing = true;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  @HostListener('window:mousemove', ['$event'])
  resizeDiv(e: any) {
    if (this.isResizing) {
      e.stopPropagation();
      this.setPreviousState();
      if (this.move === MoveDirectioneEnum.VERTICAL) {
        if (this.start === StartResizeEnum.TOP) {
          console.log('hererere');
          let dist = e.clientY - this.mouseY;
          let updatedSize = { ... this.previousSize, height: this.previousSize.height - dist, top: this.previousSize.top + dist } as DOMRect;
          this.sizeUpdated.emit(updatedSize);
          this.setResizePositions(e, this.move, this.start);
        } else {
          let dist = e.clientY - this.mouseY;
          let updatedSize = { ... this.previousSize, height: this.previousSize.height + dist, bottom: this.previousSize.bottom + dist } as DOMRect;
          this.sizeUpdated.emit(updatedSize);
          this.setResizePositions(e, this.move, this.start);
        }
      } else {
        let dist = e.clientX - this.mouseX;
        if (this.start === StartResizeEnum.LEFT) {
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
          this.sizeUpdated.emit(updatedSize);
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
          this.sizeUpdated.emit(updatedSize);
          this.setResizePositions(e, this.move, this.start);
        }
      }
      this.setPreviousState();
    }
  }

  ngAfterViewInit() {
    this.setPreviousState();
  }

  setPreviousState() {
    const element = this.ele.nativeElement;
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
}
