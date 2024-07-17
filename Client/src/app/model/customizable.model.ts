import { Utility } from "../utility/utility";
export class CustomizableModel {
  id: string;
  itemType: FormEditorTypeEnum = FormEditorTypeEnum.Input;
  name?: string;
  title?: string;
  description?: string;
  type?: 'text' | 'number';
  label?: string;
  placeholder?: string;
  appearance?: 'fill' | 'outline';
  disabled?: boolean;
  value?: any;
  domRect?: DomRectModel;
  constructor() {

    this.id = Utility.uuidv4();
    this.domRect = new DomRectModel(0, 0, 300, 100);
  }
}


export class DomRectModel {
  bottom: number = 0;
  height: number;
  right: number = 0;
  width: number;
  x: number;
  y: number;
  left: number;
  top: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.top = y;
    this.left = x;
    this.width = width;
    this.height = height;
  }
}

export const enum FormEditorTypeEnum {
  Input = 'input',
  Calendar = 'calendar',
  Checkbox = 'checkbox',
  Switch = 'switch',
  Radio = 'radio',
  Select = 'select',
  TextArea = 'textArea',
  Button = 'button',

}


export interface Message<T> {
  type: 'add' | 'update' | 'remove';
  payload: T;
}


