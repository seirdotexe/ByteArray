import ByteArray from '../index.js';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const Values = {
  INT32_MIN: -2147483648,
  INT32_MAX: 2147483647,
  UINT32_MIN: 0,
  UINT32_MAX: 4294967295
};

describe('int test', () => {
  it('should support signed integers', () => {
    const bytearr = new ByteArray();

    bytearr.writeInt(Values.INT32_MIN);
    bytearr.writeInt(Values.INT32_MIN + 1);
    bytearr.writeInt(Values.INT32_MAX);
    bytearr.writeInt(Values.INT32_MAX - 1);

    assert.equal(bytearr.position, 16);
    bytearr.position = 0;

    assert.equal(bytearr.readInt(), Values.INT32_MIN);
    assert.equal(bytearr.readInt(), Values.INT32_MIN + 1);
    assert.equal(bytearr.readInt(), Values.INT32_MAX);
    assert.equal(bytearr.readInt(), Values.INT32_MAX - 1);

    assert.throws(() => bytearr.writeInt(Values.INT32_MIN - 1));
    assert.throws(() => bytearr.writeInt(Values.INT32_MAX + 1));
  });

  it('should support unsigned integers', () => {
    const bytearr = new ByteArray();

    bytearr.writeUnsignedInt(Values.UINT32_MIN);
    bytearr.writeUnsignedInt(Values.UINT32_MAX);
    bytearr.writeUnsignedInt(Values.UINT32_MAX - 1);

    assert.equal(bytearr.position, 12);
    bytearr.position = 0;

    assert.equal(bytearr.readUnsignedInt(), Values.UINT32_MIN);
    assert.equal(bytearr.readUnsignedInt(), Values.UINT32_MAX);
    assert.equal(bytearr.readUnsignedInt(), Values.UINT32_MAX - 1);

    assert.throws(() => bytearr.writeUnsignedInt(Values.UINT32_MIN - 1));
    assert.throws(() => bytearr.writeUnsignedInt(Values.UINT32_MAX + 1));
  });
});