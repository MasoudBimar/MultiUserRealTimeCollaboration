export class ToDoItem {
  title: string = 'untitled';
  body: string = 'nobody';
  status: 'todo' | 'doing' | 'done' = 'todo';
  domRect?: DomRectModel;
  color: string;

  /**
   *
   */
  constructor(title: string, body: string) {
    this.body = body;
    this.title = title;
    this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    // this.domRect = new DomRectModel(0, 0, 250, 250);

  }
}

export class DomRectModel {
  bottom?: number;
  height?: number;
  left?: number;
  right?: number;
  top?: number;
  width?: number;
  x?: number;
  y?: number;
  /**
   *
   */
  constructor(x?: number, y?: number, width?: number, height?: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
