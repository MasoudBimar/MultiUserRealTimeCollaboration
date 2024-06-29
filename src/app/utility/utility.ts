export class Utility {
  static stringify(object: any) {

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
      } else {
        // Object
        let str = '{';
        let entries = Object.entries(object);
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
    let rect = element.getBoundingClientRect();
    console.log("🚀 ~ Utility ~ calculateClientRect ~ rect:", rect)
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
}
