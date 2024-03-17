import ByteArray from '../index.js';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const Values = {
  INT16_MIN: -32768,
  INT16_MAX: 32767,
  UINT16_MIN: 0,
  UINT16_MAX: 65535
};

describe('short test', () => {
  it('should support signed shorts', () => {
    const bytearr = new ByteArray();

    bytearr.writeShort(Values.INT16_MIN);
    bytearr.writeShort(Values.INT16_MIN + 1);
    bytearr.writeShort(Values.INT16_MAX);
    bytearr.writeShort(Values.INT16_MAX - 1);

    assert.equal(bytearr.position, 8);
    bytearr.position = 0;

    assert.equal(bytearr.readShort(), Values.INT16_MIN);
    assert.equal(bytearr.readShort(), Values.INT16_MIN + 1);
    assert.equal(bytearr.readShort(), Values.INT16_MAX);
    assert.equal(bytearr.readShort(), Values.INT16_MAX - 1);

    assert.throws(() => bytearr.writeShort(Values.INT16_MIN - 1));
    assert.throws(() => bytearr.writeShort(Values.INT16_MAX + 1));
  });

  it('should support unsigned shorts', () => {
    const bytearr = new ByteArray();

    bytearr.writeUnsignedShort(Values.UINT16_MIN);
    bytearr.writeUnsignedShort(Values.UINT16_MAX);
    bytearr.writeUnsignedShort(Values.UINT16_MAX - 1);

    assert.equal(bytearr.position, 6);
    bytearr.position = 0;

    assert.equal(bytearr.readUnsignedShort(), Values.UINT16_MIN);
    assert.equal(bytearr.readUnsignedShort(), Values.UINT16_MAX);
    assert.equal(bytearr.readUnsignedShort(), Values.UINT16_MAX - 1);

    assert.throws(() => bytearr.writeUnsignedShort(Values.UINT16_MIN - 1));
    assert.throws(() => bytearr.writeUnsignedShort(Values.UINT16_MAX + 1));
  });
});