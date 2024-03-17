import ByteArray from '../index.js';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const Values = {
  Size1: [1, 3, 7, 15, 31, 63, 64, 65, 73, 119, 127],
  Size2: [255, 383, 511, 639, 1023, 1151, 2047, 2175, 4095, 4223, 8191, 8319, 16383],
  Size3: [32702, 32766, 32767, 65404, 65532, 65535, 130808, 131064, 131071, 261616, 262128, 262143, 523232, 524256, 524287, 1046464, 1048512, 1048575, 2092928, 2097024, 2097151],
  Size4: [4194303, 8388607, 16777215, 33554431, 67108863, 134217727]
};

describe('uint29 test', () => {
  it('should support uint29 with size 1', () => {
    const bytearr = new ByteArray();

    for (let i = 0; i < Values.Size1.length; i++) {
      const value = Values.Size1[i];

      bytearr.writeUnsignedInt29(value);
      bytearr.position = 0;
      assert.equal(bytearr.readUnsignedInt29(), value);

      bytearr.clear();
    }
  });

  it('should support uint29 with size 2', () => {
    const bytearr = new ByteArray();

    for (let i = 0; i < Values.Size2.length; i++) {
      const value = Values.Size2[i];

      bytearr.writeUnsignedInt29(value);
      bytearr.position = 0;
      assert.equal(bytearr.readUnsignedInt29(), value);

      bytearr.clear();
    }
  });

  it('should support uint29 with size 3', () => {
    const bytearr = new ByteArray();

    for (let i = 0; i < Values.Size3.length; i++) {
      const value = Values.Size3[i];

      bytearr.writeUnsignedInt29(value);
      bytearr.position = 0;
      assert.equal(bytearr.readUnsignedInt29(), value);

      bytearr.clear();
    }
  });

  it('should support uint29 with size 4', () => {
    const bytearr = new ByteArray();

    for (let i = 0; i < Values.Size4.length; i++) {
      const value = Values.Size4[i];

      bytearr.writeUnsignedInt29(value);
      bytearr.position = 0;
      assert.equal(bytearr.readUnsignedInt29(), value);

      bytearr.clear();
    }
  });
});