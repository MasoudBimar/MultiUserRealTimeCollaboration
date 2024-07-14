import { Utility } from "../utility/utility";
export class CustomizableModel {
  id: string;
  domRect?: DomRectModel;
  itemType: FormEditorTypeEnum = FormEditorTypeEnum.Input;
  componentInputs: Partial<Record<keyof ComponentInput, unknown>>;

  constructor() {
    this.domRect = new DomRectModel(0, 0, 300, 100);
    this.id = Utility.uuidv4();
    this.componentInputs = { id: this.id };
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
  Input = 'input',
  Calendar = 'calendar',
  Checkbox = 'checkbox',
  Switch = 'switch',
  Radio = 'radio',
  Select = 'select',
  TextArea = 'textArea',
  Button = 'button',

}

export interface ComponentInput {
  id: string;
  name: string;
  title: string;
  description: string;
  direction: "ltr" | "rtl";
  width: string;
  height: string;
  display: 'block' | 'inline' | 'inline-block' | 'flex';
  type: 'text' | 'number';
  label: string;
  placeholder: string;
  appearance: 'fill' | 'outline';
  labelPosition: "default" | "start" | "top";
  disabled: boolean;
  value: any;
  margin: string;
  padding: string;
}


