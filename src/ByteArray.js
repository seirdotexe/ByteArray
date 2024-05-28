import iconv from 'iconv-lite';
import assert from 'node:assert/strict';
import { promisify } from 'node:util';
import zlib from 'node:zlib';
import Enums from './Enums.js';
import Utils from './Utils.js';

const deflate = promisify(zlib.deflate);
const inflate = promisify(zlib.inflate);

const deflateRaw = promisify(zlib.deflateRaw);
const inflateRaw = promisify(zlib.inflateRaw);

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const brotliCompress = promisify(zlib.brotliCompress);
const brotliDecompress = promisify(zlib.brotliDecompress);

/**
 * @class
 * @module ByteArray
 */
export class ByteArray {
  /**
   * @private
   * @description The buffer
   * @type {Buffer}
   */
  #buffer;
  /**
   * @private
   * @description The position
   * @type {number}
   */
  #position;
  /**
   * @private
   * @description The endianness
   * @type {string}
   */
  #endian;

  /**
   * @description Creates a new ByteArray
   * @param {Buffer|ByteArray|number|any[]|string|ArrayBufferView?} buffer - An optional source of data
   */
  constructor(buffer) {
    /**
     * @private
     * @description The buffer
     * @type {Buffer}
     */
    this.#buffer = Utils.convertToBuffer(buffer);
    /**
     * @private
     * @description The position
     * @type {number}
     */
    this.#position = 0;
    /**
     * @private
     * @description The endianness
     * @type {string}
     */
    this.#endian = Enums.Endian.BIG_ENDIAN;
  }

  /**
   * @description Overwrite for inspecting on the ByteArray class
   * @returns {string} The custom string showing the ByteArray class
   */
  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `ByteArray {
      \r  buffer: ${Utils.convertBufferToString(this.#buffer)},
      \r  position: ${this.#position},
      \r  endian: '${this.#endian}'
    \r}`;
  }

  /**
   * @description Support for iterating over the buffer
   * @yields {number} The byte in the buffer
   */
  *[Symbol.iterator]() {
    for (let i = 0; i < this.length; i++) {
      yield this.#buffer[i];
    }
  }

  /**
   * @private
   * @description Ensures there's enough capacity to write to the buffer, and else it increases the capacity
   * @param {number} value - The amount of bytes to grow the buffer with when there's not enough capacity
   */
  #ensureCapacity(value) {
    if (this.bytesAvailable < value) {
      const old = this.#buffer;
      const size = (old.length + (value - this.bytesAvailable));

      this.#buffer = Buffer.alloc(size);

      old.copy(this.#buffer);
    }
  }

  /**
   * @private
   * @description Executes a buffer call
   * @param {string} name - The function to call
   * @param {number} size - The byte size
   * @param {number?} value - The value to write, only when calling write a function
   * @returns {number?} When reading, the value that's read is returned
   */
  #executeBufferCall(name, size, value) {
    //? A byte has a size of 1 and therefor doesn't have endianness
    const func = (size === 1) ? name : `${name}${this.#endian}`;

    if (arguments.length === 3) {
      this.#ensureCapacity(size);

      this.#buffer[func](value, this.#position);
      this.#position += size;
    } else {
      const value = this.#buffer[func](this.#position);

      this.#position += size;

      return value;
    }
  }

  /**
   * @private
   * @description Returns the amount of overwritable bytes available
   * @param {number} position - The starting position
   * @param {number} bytesAvailable - The amount of bytes available
   * @returns {number} The amount of overwritable bytes available
   */
  #getOverwritableBytesAvailable(position, bytesAvailable) {
    //? This is needed because bytesAvailable uses the position, which isn't incremented during overwriting
    //? We also have to add 1 when the provided position is 0 to support zero-index
    return ((position + (position === 0 ? 1 : 0)) - bytesAvailable);
  }

  /**
   * @description Returns the buffer
   * @returns {Buffer} The buffer
   */
  get buffer() {
    return this.#buffer;
  }

  /**
   * @description Returns the position
   * @returns {number} The position
   */
  get position() {
    return this.#position;
  }

  /**
   * @description Sets the position
   * @param {number} value - The value to set the position to
   * @throws {AssertionError} The value must be a number
   */
  set position(value) {
    assert.ok(Utils.isNumber(value), `Cannot set property 'position' on ByteArray with value '${value}'.`)

    this.#position = value;
  }

  /**
   * @description Returns the endianness
   * @default BIG_ENDIAN
   * @returns {string} The endianness
   */
  get endian() {
    return this.#endian;
  }

  /**
   * @description Sets the endianness
   * @default BIG_ENDIAN
   * @param {string} value - The value to set the endianness to
   * @throws {AssertionError} The value must be a valid endianness
   */
  set endian(value) {
    assert.ok((value === Enums.Endian.BIG_ENDIAN) || (value === Enums.Endian.LITTLE_ENDIAN), `Cannot set property 'endian' on ByteArray with value '${value}'.`);

    this.#endian = value;
  }

  /**
   * @description Returns the amount of bytes available
   * @returns {number} The amount of bytes available
   */
  get bytesAvailable() {
    return (this.length - this.#position);
  }

  /**
   * @description Returns the length of the buffer
   * @returns {number} The length of the buffer
   */
  get length() {
    return this.#buffer.length;
  }

  /**
   * @description Sets the length
   * @param {number} value - The value to set the length of the buffer to
   * @throws {AssertionError} The value must be a number
   */
  set length(value) {
    assert.ok(Utils.isNumber(value), `Cannot set property 'length' on ByteArray with value '${value}'.`);

    if (value === 0) {
      this.clear();
    } else if (value < this.length) {
      this.#buffer = this.#buffer.subarray(0, value);
      this.#position = this.length;
    } else if (value > this.length) {
      this.#ensureCapacity(this.#getOverwritableBytesAvailable(value, this.#position));
    }
  }

  /**
   * @description Returns a value on the given position in the buffer
   * @param {number} position - The position in the buffer
   * @throws {AssertionError} The value must be a number
   * @returns {number} The value on the position
   */
  get(position) {
    assert.ok(Utils.isNumber(position), `Cannot get property 'position' on ByteArray with value '${position}'.`);

    return this.#buffer[position];
  }

  /**
   * @description Sets a value on the given position in the buffer
   * @param {number} position - The position in the buffer
   * @param {number} value - The value to set on the position
   * @throws {AssertionError} The value must be a number
   */
  set(position, value) {
    assert.ok(Utils.isNumber(position), `Cannot get property 'position' on ByteArray with value '${position}'.`);
    assert.ok(Utils.isNumber(value, false), `Cannot set property 'position' on ByteArray with value '${value}'.`);

    this.#ensureCapacity(this.#getOverwritableBytesAvailable(position, this.length));
    this.#buffer[position] = value;
  }

  /**
   * @description Clears the buffer and resets the position
   */
  clear() {
    this.#buffer = Buffer.alloc(0);
    this.#position = 0;
  }

  /**
   * @description Converts the buffer to string
   * @returns {string} The buffer represented as a string
   */
  toString() {
    return this.#buffer.toString();
  }

  /**
   * @description Converts the buffer to JSON
   * @returns {Object} The buffer represented as an object
   */
  toJSON() {
    return { ...this.#buffer.toJSON().data };
  }

  /**
   * @async
   * @description Compresses the buffer
   * @param {string} [algorithm=zlib] - The algorithm to compress the buffer with
   * @throws {ReferenceError} The value must be a valid compression algorithm
   */
  async compress(algorithm = Enums.CompressionAlgorithm.ZLIB) {
    if (this.length === 0) {
      return;
    }

    switch (algorithm) {
      case Enums.CompressionAlgorithm.ZLIB:
        this.#buffer = await deflate(this.#buffer, { level: zlib.constants.Z_BEST_COMPRESSION });
        break;
      case Enums.CompressionAlgorithm.DEFLATE:
        this.#buffer = await deflateRaw(this.#buffer);
        break;
      case Enums.CompressionAlgorithm.GZIP:
        this.#buffer = await gzip(this.#buffer);
        break;
      case Enums.CompressionAlgorithm.BROTLI:
        this.#buffer = await brotliCompress(this.#buffer);
        break;
      default:
        throw new ReferenceError(`Invalid compression algorithm: '${algorithm}'.`);
    }

    this.#position = this.length;
  }

  /**
   * @async
   * @description Decompresses the buffer
   * @param {string} [algorithm=zlib] - The algorithm to decompress the buffer with
   * @throws {ReferenceError} The value must be a valid compression algorithm
   */
  async decompress(algorithm = Enums.CompressionAlgorithm.ZLIB) {
    if (this.length === 0) {
      return;
    }

    switch (algorithm) {
      case Enums.CompressionAlgorithm.ZLIB:
        this.#buffer = await inflate(this.#buffer, { level: zlib.constants.Z_BEST_COMPRESSION });
        break;
      case Enums.CompressionAlgorithm.DEFLATE:
        this.#buffer = await inflateRaw(this.#buffer);
        break;
      case Enums.CompressionAlgorithm.GZIP:
        this.#buffer = await gunzip(this.#buffer);
        break;
      case Enums.CompressionAlgorithm.BROTLI:
        this.#buffer = await brotliDecompress(this.#buffer);
        break;
      default:
        throw new ReferenceError(`Invalid decompression algorithm: '${algorithm}'.`);
    }

    this.#position = 0;
  }

  /**
   * @description Writes a signed byte
   * @param {number} value - The value to write
   */
  writeByte(value) {
    this.#executeBufferCall('writeInt8', 1, value);
  }

  /**
   * @description Reads a signed byte
   * @returns {number} The value that's read
   */
  readByte() {
    return this.#executeBufferCall('readInt8', 1);
  }

  /**
   * @description Writes an unsigned byte
   * @param {number} value - The value to write
   */
  writeUnsignedByte(value) {
    this.#executeBufferCall('writeUInt8', 1, value);
  }

  /**
   * @description Reads an unsigned byte
   * @returns {number} The value that's read
   */
  readUnsignedByte() {
    return this.#executeBufferCall('readUInt8', 1);
  }

  /**
   * @description Writes a sequence of bytes
   * @param {ByteArray|Buffer} bytes - The ByteArray (or buffer) to write the data from
   * @param {number} [offset=0] - The position into the ByteArray to begin writing
   * @param {number} [length=0] - The length of how far into the ByteArray to write
   * @throws {AssertionError} The 'bytes' argument must be instanceof ByteArray
   */
  writeBytes(bytes, offset = 0, length = 0) {
    assert.ok(Utils.isByteArray(bytes) || Buffer.isBuffer(bytes), `The 'bytes' argument must be instanceof ByteArray.`);

    //? Internal support for buffer support
    if (Buffer.isBuffer(bytes)) {
      bytes = { buffer: bytes };
    }

    if (length === 0) {
      length = (bytes.buffer.length - offset);
    }

    this.#ensureCapacity(length);

    for (let i = 0; i < length; i++) {
      this.#buffer[i + this.#position] = bytes.buffer[i + offset];
    }

    this.#position += length;
  }

  /**
   * @description Reads a sequence of bytes
   * @param {ByteArray} bytes - The ByteArray to read data into
   * @param {number} [offset=0] - The position at which the read data should be written
   * @param {number} [length=0] - The number of bytes to read
   * @throws {AssertionError} The 'bytes' argument must be instanceof ByteArray
   * @throws {RangeError} If the given length is greater than the amount of bytes available
   */
  readBytes(bytes, offset = 0, length = 0) {
    assert.ok(Utils.isByteArray(bytes), `The 'bytes' argument must be instanceof ByteArray.`);

    if (length === 0) {
      length = this.bytesAvailable;
    }

    if (length > this.bytesAvailable) {
      throw new RangeError(`End of buffer was encountered.`);
    }

    if (bytes.length < offset + length) {
      bytes.#ensureCapacity(offset + length);
    }

    for (let i = 0; i < length; i++) {
      bytes.buffer[i + offset] = this.#buffer[i + this.#position];
    }

    this.#position += length;
  }

  /**
   * @description Writes a Boolean value
   * @param {boolean|number} value - The value to write
   */
  writeBoolean(value) {
    this.writeByte(value ? 1 : 0);
  }

  /**
   * @description Reads a Boolean value
   * @returns {boolean} The value that's read
   */
  readBoolean() {
    return (this.readByte() !== 0);
  }

  /**
   * @description Writes a 16-bit signed integer
   * @param {number} value - The value to write
   */
  writeShort(value) {
    this.#executeBufferCall('writeInt16', 2, value);
  }

  /**
   * @description Reads a signed 16-bit integer
   * @returns {number} The value that's read
   */
  readShort() {
    return this.#executeBufferCall('readInt16', 2);
  }

  /**
   * @description Writes a 16-bit unsigned integer
   * @param {number} value - The value to write
   */
  writeUnsignedShort(value) {
    this.#executeBufferCall('writeUInt16', 2, value);
  }

  /**
   * @description Reads an unsigned 16-bit integer
   * @returns {number} The value that's read
   */
  readUnsignedShort() {
    return this.#executeBufferCall('readUInt16', 2);
  }

  /**
   * @description Writes a 32-bit signed integer
   * @param {number} value - The value to write
   */
  writeInt(value) {
    this.#executeBufferCall('writeInt32', 4, value);
  }

  /**
   * @description Reads a signed 32-bit integer
   * @returns {number} The value that's read
   */
  readInt() {
    return this.#executeBufferCall('readInt32', 4);
  }

  /**
   * @description Writes a 32-bit unsigned integer
   * @param {number} value - The value to write
   */
  writeUnsignedInt(value) {
    this.#executeBufferCall('writeUInt32', 4, value);
  }

  /**
   * @description Reads an unsigned 32-bit integer
   * @returns {number} The value that's read
   */
  readUnsignedInt() {
    return this.#executeBufferCall('readUInt32', 4);
  }

  /**
   * @description Writes an IEEE 754 single-precision (32-bit) floating-point number
   * @param {number} value - The value to write
   */
  writeFloat(value) {
    this.#executeBufferCall('writeFloat', 4, value);
  }

  /**
   * @description Reads an IEEE 754 single-precision (32-bit) floating-point number
   * @returns {number} The value that's read
   */
  readFloat() {
    return this.#executeBufferCall('readFloat', 4);
  }

  /**
   * @description Writes an IEEE 754 double-precision (64-bit) floating-point number
   * @param {number} value - The value to write
   */
  writeDouble(value) {
    this.#executeBufferCall('writeDouble', 8, value);
  }

  /**
   * @description Reads an IEEE 754 double-precision (64-bit) floating-point number
   * @returns {number} The value that's read
   */
  readDouble() {
    return this.#executeBufferCall('readDouble', 8);
  }

  /**
   * @description Writes a 64-bit signed integer
   * @param {BigInt} value - The value to write
   */
  writeLong(value) {
    this.#executeBufferCall('writeBigInt64', 8, value);
  }

  /**
   * @description Reads a 64-bit signed integer
   * @returns {BigInt} The value that's read
   */
  readLong() {
    return this.#executeBufferCall('readBigInt64', 8);
  }

  /**
   * @description Writes a 64-bit unsigned integer
   * @param {BigInt} value - The value to write
   */
  writeUnsignedLong(value) {
    this.#executeBufferCall('writeBigUint64', 8, value);
  }

  /**
   * @description Reads a 64-bit unsigned integer
   * @returns {BigInt} The value that's read
   */
  readUnsignedLong() {
    return this.#executeBufferCall('readBigUint64', 8);
  }

  /**
   * @description Writes a multibyte string
   * @param {string} value - The value to write
   * @param {string} [charSet=utf8] - The character set to encode the value with
   * @param {boolean} [source=false] - An internal parameter used for writeUTF to write the length of the string
   * @throws {AssertionError} The character set must exist
   */
  writeMultiByte(value, charSet = 'utf8', source = false) {
    assert.ok(iconv.encodingExists(charSet), `Invalid character set: '${charSet}'.`);

    const encoded = iconv.encode(value, charSet, { addBOM: false });
    const { length } = encoded;

    //? Internal support for writeUTF
    if (source) {
      this.writeUnsignedShort(length);
    }

    this.writeBytes(encoded, 0, length);
  }

  /**
   * @description Reads a multibyte string
   * @param {number} length - The number of bytes to read
   * @param {string} [charSet=utf8] - The character set to decode the value into
   * @throws {AssertionError} The character set must exist
   * @returns {string} The value that's read
   */
  readMultiByte(length, charSet = 'utf8') {
    assert.ok(iconv.encodingExists(charSet), `Invalid character set: '${charSet}'.`);

    const buffer = this.#buffer.subarray(this.#position, this.#position + length);
    const value = iconv.decode(buffer, charSet);

    this.#position += length;

    return value;
  }

  /**
   * @description Writes a UTF8 string
   * @param {string} value - The value to write
   */
  writeUTF(value) {
    this.writeMultiByte(value, 'utf8', true);
  }

  /**
   * @description Reads a UTF8 string
   * @returns {string} The value that's read
   */
  readUTF() {
    return this.readMultiByte(this.readUnsignedShort());
  }

  /**
   * @description Writes a UTF8 string
   * @param {string} value - The value to write
   */
  writeUTFBytes(value) {
    this.writeMultiByte(value);
  }

  /**
   * @description Reads a sequence of UTF8 bytes
   * @param {number} length - The number of bytes to read
   * @returns {string} The value that's read
   */
  readUTFBytes(length) {
    return this.readMultiByte(length);
  }

  /**
   * @description Writes a variable length unsigned 29-bit integer
   * @param {number} value - The value to write
   * @throws {AssertionError} If the given value is greater than 2^29 - 1
   */
  writeUnsignedInt29(value) {
    const size = (value < 0x80) ? 1 : (value < 0x4000) ? 2 : (value < 0x200000) ? 3 : (value < 0x40000000) ? 4 : 0;

    assert.ok(size, `The value: '${value}' is out of range.`);

    this.#ensureCapacity(size);

    if (size === 1) {
      this.writeUnsignedByte(value);
    } else if (size === 2) {
      this.writeUnsignedByte(((value >> 7) & 0x7F) | 0x80);
      this.writeUnsignedByte(value & 0x7F);
    } else if (size === 3) {
      this.writeUnsignedByte(((value >> 14) & 0x7F) | 0x80);
      this.writeUnsignedByte(((value >> 7) & 0x7F) | 0x80);
      this.writeUnsignedByte(value & 0x7F);
    } else {
      this.writeUnsignedByte(((value >> 22) & 0x7F) | 0x80);
      this.writeUnsignedByte(((value >> 15) & 0x7F) | 0x80);
      this.writeUnsignedByte(((value >> 8) & 0x7F) | 0x80);
      this.writeUnsignedByte(value & 0xFF);
    }
  }

  /**
   * @description Reads a variable length unsigned 29-bit integer
   * @returns {number} The value that's read
   */
  readUnsignedInt29() {
    let byte = this.readUnsignedByte();

    if (byte < 128) {
      return byte;
    }

    let value = (byte & 0x7F) << 7;
    byte = this.readUnsignedByte();

    if (byte < 128) {
      return (value | byte);
    }

    value = (value | (byte & 0x7F)) << 7;
    byte = this.readUnsignedByte();

    if (byte < 128) {
      return (value | byte);
    }

    value = (value | (byte & 0x7F)) << 8;
    byte = this.readUnsignedByte();

    return (value | byte);
  }
}