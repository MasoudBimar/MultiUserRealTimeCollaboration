import { Utility } from "../utility/utility";
export class CustomizableModel<T> {
  id: string;
  domRect?: DomRectModel;
  metaData?: MetaData;
  itemType: 'input' | 'button' = 'input';

  constructor() {
    if (this.itemType === 'input') {
      this.domRect = new DomRectModel(0, 0, 300, 100);
    } else if(this.itemType === 'button') {
      this.domRect = new DomRectModel(0, 0, 100, 50);
    }
    this.id = Utility.uuidv4();
  }
}

export class MetaData {

  label: string ;
  body: string;
  // status: 'todo' | 'doing' | 'done' = 'todo';
  value: any;


  constructor(label: string = 'untitled', body: string = 'nobody') {
    this.body = body;
    this.label = label;
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
