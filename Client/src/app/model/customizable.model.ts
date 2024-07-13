import { Utility } from "../utility/utility";
export class CustomizableModel {
  id: string;
  domRect?: DomRectModel;
  metaData?: MetaData;
  itemType: FormEditorTypeEnum = FormEditorTypeEnum.Input;

  constructor() {
    if (this.itemType === FormEditorTypeEnum.Input) {
      this.domRect = new DomRectModel(0, 0, 300, 100);
    } else if (this.itemType === FormEditorTypeEnum.Button) {
      this.domRect = new DomRectModel(0, 0, 100, 50);
    }
    this.id = Utility.uuidv4();
  }
}

export class MetaData {

  // label: string;
  // body: string;
  value: unknown;


  constructor(public label = 'untitled', public body = 'nobody') {

  }
}

export class DomRectModel {
  bottom: number = 0;
  height: number;
  left: number = 0;
  right: number = 0;
  top: number = 0;
  width: number;
  x: number;
  y: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

export const enum FormEditorTypeEnum {
  Calendar = 'calendar',
  Checkbox = 'checkbox',
  Switch = 'switch',
  Input = 'input',
  Radio = 'radio',
  Select = 'select',
  TextArea = 'textArea',
  Button = 'button'
}
