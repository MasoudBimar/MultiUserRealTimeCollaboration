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
      } else {
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


  static decompressArrayBuffer = async (input: ArrayBuffer): Promise<Uint8Array> =>{
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

}