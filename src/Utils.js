/**
 * @typedef {import('./ByteArray.js').ByteArray} ByteArray
 */

/**
 * @exports
 * @default
 * @class
 * @module Utils
 */
export default class Utils {
  /**
   * @static
   * @description Returns whether the value is a ByteArray
   * @param {any} value - The value to check
   * @returns {boolean} Whether the value is a ByteArray
   */
  static isByteArray(value) {
    return (value?.constructor?.name === 'ByteArray');
  }

  /**
   * @static
   * @description Returns whether the value is a number
   * @param {number} value - The value to check
   * @param {boolean} [positive=true] - Checks if the value should be positive
   * @returns {boolean} If the value is a number
   */
  static isNumber(value, positive = true) {
    if (!Number.isSafeInteger(value)) {
      return false;
    }

    if (positive && value < 0) {
      return false;
    }

    return true;
  }

  /**
   * @static
   * @description Returns the value as a buffer in which an attempt is made as best as possible
   * @param {Buffer|ByteArray|number|any[]|string|ArrayBufferView?} value - The value to convert to a buffer
   * @returns {Buffer} The converted buffer
   */
  static convertToBuffer(value) {
    if (Buffer.isBuffer(value)) {
      return value;
    } else if (Utils.isByteArray(value)) {
      return value.buffer;
    } else if (Utils.isNumber(value)) {
      return Buffer.alloc(value);
    } else if (Array.isArray(value)) {
      return Buffer.from(value);
    } else if (typeof value === 'string') {
      return Buffer.from(value);
    } else if (ArrayBuffer.isView(value)) {
      return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
    } else {
      return Buffer.alloc(0);
    }
  }

  /**
   * @static
   * @description Returns the value buffer as a string
   * @param {Buffer} value - The value buffer to convert to a string
   * @returns {string} The buffer as a string
   */
  static convertBufferToString(value) {
    if (value.length === 0) {
      return '<Buffer >';
    }

    const INSPECT_MAX_BYTES = 50;
    let bufferString = '<Buffer ';

    for (let i = 0; i < value.length; i++) {
      if (i >= INSPECT_MAX_BYTES) {
        const hasLeft = (value.length - i);
        const plural = (hasLeft === 1) ? 'byte' : 'bytes';

        bufferString += `... ${hasLeft} more ${plural}`;

        break;
      }

      bufferString += value[i].toString(16).padStart(2, '0');

      if (i < (value.length - 1)) {
        bufferString += ' ';
      }
    }

    return `${bufferString}>`;
  }
}