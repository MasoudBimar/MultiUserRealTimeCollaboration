import { Type } from "@angular/core";
import { CardComponent } from "../components/card/card.component";
import { InputComponent } from "../components/input/input.component";
import { CalendarComponent } from "../components/calendar/calendar.component";
import { CheckboxComponent } from "../components/checkbox/checkbox.component";
import { RadioComponent } from "../components/radio/radio.component";
import { SelectComponent } from "../components/select/select.component";
import { TextAreaComponent } from "../components/text-area/text-area.component";
import { ButtonComponent } from "../components/button/button.component";

export class Utility {
  static stringify(object: unknown): string {

    // Base case for null
    if (object === null) {
      return 'null';
    }

    // Base case for undefined
    if (object === undefined) {
      return 'undefined';
    }

    // Objects and Arrays need recursion
    if (typeof object === 'object') {
      if (Array.isArray(object)) {
        // Array
        let str = '[';
        str += object.map(value => Utility.stringify(value)).join(',');
        str += ']';
        return str;
      } else if (object instanceof Map) {
        // let str = '{';
        const str = JSON.stringify(Object.fromEntries(object));
        // str += '}';
        return str;
      }
      else {
        // Object
        let str = '{';
        const entries = Object.entries(object);
        str += entries.map(entry => {
          return `"${entry[0]}":${Utility.stringify(entry[1])}`;
        }).join(',');
        str += '}';
        return str;
      }
    }

    // Primitives just need converting to a string
    if (typeof object === 'string') {
      return `"${object}"`;
    }
    if (typeof object === 'number' || typeof object === 'boolean') {
      return object.toString();
    }

    return '';

  }

  static calculateClientRect(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    rect.width = 250;
    rect.height = 250;
    return rect;
  }

  static uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }

  static compressArrayBuffer = async (input: ArrayBuffer) => {
    //create the stream
    const cs = new CompressionStream("gzip");
    //create the writer
    const writer = cs.writable.getWriter();
    //write the buffer to the writer
    writer.write(input);
    writer.close();
    //create the output
    const output: Uint8Array[] = [];
    const reader = cs.readable.getReader();
    let totalSize = 0;
    //go through each chunk and add it to the output
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      output.push(value);
      totalSize += value.byteLength;
    }
    const concatenated = new Uint8Array(totalSize);
    let offset = 0;
    //finally build the compressed array and return it
    for (const array of output) {
      concatenated.set(array, offset);
      offset += array.byteLength;
    }
    return concatenated;
  };


  static decompressArrayBuffer = async (input: ArrayBuffer): Promise<Uint8Array> => {
    //create the stream
    const ds = new DecompressionStream("gzip");
    //create the writer
    const writer = ds.writable.getWriter();
    //write the buffer to the writer thus decompressing it
    writer.write(input);
    writer.close();
    //create the output
    const output: Uint8Array[] = [];
    //create the reader
    const reader = ds.readable.getReader();
    let totalSize = 0;
    //go through each chunk and add it to the output
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      output.push(value);
      totalSize += value.byteLength;
    }
    const concatenated = new Uint8Array(totalSize);
    let offset = 0;
    //finally build the compressed array and return it
    for (const array of output) {
      concatenated.set(array, offset);
      offset += array.byteLength;
    }
    return concatenated;
  }

  static replacer(key: string, value: unknown) {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }
  static reviver(key: string, value: any) {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  static componentTypeResolver(): (type: string) => Type<unknown>{

    const componentMapRegistery = Utility.getComponentList();
    return function typeResolver(type: string): Type<unknown>{
      return componentMapRegistery.get(type) ?? CardComponent;
    }
  }

  static getComponentList(): Map<string, Type<unknown>>{
    const componentMapRegistery = new Map<string, Type<unknown>>();
    componentMapRegistery.set('input', InputComponent);
    componentMapRegistery.set('calendar', CalendarComponent);
    componentMapRegistery.set('checkbox', CheckboxComponent);
    componentMapRegistery.set('card', CardComponent);
    componentMapRegistery.set('radio', RadioComponent);
    componentMapRegistery.set('select', SelectComponent);
    componentMapRegistery.set('textArea', TextAreaComponent);
    componentMapRegistery.set('button', ButtonComponent);
    return componentMapRegistery;
  }

}
