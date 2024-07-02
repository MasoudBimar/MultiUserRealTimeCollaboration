import { Utility } from "../utility/utility";
export class CustomizableModel<T>{
  id?: string;
  domRect?: DomRectModel;
  metaData?: T;

  constructor() {
    this.domRect = new DomRectModel(0, 0, 250, 250);
    this.id = Utility.uuidv4();
  }
}

export class ToDoItem {

  title: string = 'untitled';
  body: string = 'nobody';
  status: 'todo' | 'doing' | 'done' = 'todo';


  constructor(title: string, body: string) {
    this.body = body;
    this.title = title;
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

  constructor(x?: number, y?: number, width?: number, height?: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
