import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import ByteArray, { Enums, Utils } from '../index.js';

describe('class test', () => {
  it('should construct the class', () => {
    const bytearr = new ByteArray();

    assert.ok(Buffer.isBuffer(bytearr.buffer));
    assert.ok(Utils.isByteArray(bytearr));

    assert.equal(bytearr.position, 0);
    assert.equal(bytearr.endian, Enums.Endian.BIG_ENDIAN);
    assert.equal(bytearr.bytesAvailable, 0);
    assert.equal(bytearr.length, 0);
  });

  it('should have enums', () => {
    assert.equal(Enums.CompressionAlgorithm.ZLIB, 'zlib');
    assert.equal(Enums.CompressionAlgorithm.DEFLATE, 'deflate');
    assert.equal(Enums.CompressionAlgorithm.GZIP, 'gzip');
    assert.equal(Enums.CompressionAlgorithm.BROTLI, 'brotli');

    assert.equal(Enums.Endian.LITTLE_ENDIAN, 'LE');
    assert.equal(Enums.Endian.BIG_ENDIAN, 'BE');
  });

  it('should support bytesAvailable', () => {
    const bytearr = new ByteArray();

    bytearr.writeUTFBytes('Hello World');

    bytearr.position = 0;
    assert.equal(bytearr.readUTFBytes(bytearr.bytesAvailable - 6), 'Hello');

    bytearr.position = 6;
    assert.equal(bytearr.readUTFBytes(bytearr.bytesAvailable), 'World');

    bytearr.position = 0;
    assert.equal(bytearr.readUTFBytes(bytearr.bytesAvailable), 'Hello World');
  });

  it('should support clear', () => {
    const bytearr = new ByteArray();

    bytearr.writeUTFBytes('Hello World');

    assert.equal(bytearr.length, 11);
    assert.equal(bytearr.position, 11);

    bytearr.clear();

    assert.equal(bytearr.length, 0);
    assert.equal(bytearr.position, 0);
  });

  it('should support toString', () => {
    const bytearr = new ByteArray();

    bytearr.writeUTFBytes('This is a test.');
    assert.equal(bytearr.toString(), 'This is a test.');
  });

  it('should support toJSON', () => {
    const bytearr = new ByteArray([4, 5, 6]);
    const json = bytearr.toJSON();

    assert.equal(json['0'], bytearr.get(0));
    assert.equal(json['1'], bytearr.get(1));
    assert.equal(json['2'], bytearr.get(2));
  });

  it('should support overwriting with length', { todo: true }, () => { });

  it('should support overwriting with set', { todo: true }, () => { });

  it('should support length', { todo: true }, () => { });

  it('should support get/set', { todo: true }, () => { });

  it('should convert data in constructor', () => {
    const b1 = new ByteArray(Buffer.from('ABC'));
    assert.equal(b1.get(0), 65);
    assert.equal(b1.get(1), 66);
    assert.equal(b1.get(2), 67);

    const b2 = new ByteArray(b1);
    assert.equal(b2.get(0), 65);
    assert.equal(b2.get(1), 66);
    assert.equal(b2.get(2), 67);

    const b3 = new ByteArray(10);
    assert.equal(b3.length, 10);

    const b4 = new ByteArray([65, 66, 67]);
    assert.equal(b4.get(0), 65);
    assert.equal(b4.get(1), 66);
    assert.equal(b4.get(2), 67);

    const b5 = new ByteArray('ABC');
    assert.equal(b5.get(0), 65);
    assert.equal(b5.get(1), 66);
    assert.equal(b5.get(2), 67);

    const b6 = new ByteArray(new Int8Array([65, 66, 67]));
    assert.equal(b6.get(0), 65);
    assert.equal(b6.get(1), 66);
    assert.equal(b6.get(2), 67);

    const b7 = new ByteArray({ id: 1 });
    assert.equal(b7.length, 0);
  });
});