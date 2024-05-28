import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import ByteArray from '../index.js';

const Values = {
  INT8_MIN: -128,
  INT8_MAX: 127,
  UINT8_MIN: 0,
  UINT8_MAX: 255
};

describe('byte test', () => {
  it('should support signed bytes', () => {
    const bytearr = new ByteArray();

    bytearr.writeByte(Values.INT8_MIN);
    bytearr.writeByte(Values.INT8_MIN + 1);
    bytearr.writeByte(Values.INT8_MAX);
    bytearr.writeByte(Values.INT8_MAX - 1);

    assert.equal(bytearr.position, 4);
    bytearr.position = 0;

    assert.equal(bytearr.readByte(), Values.INT8_MIN);
    assert.equal(bytearr.readByte(), Values.INT8_MIN + 1);
    assert.equal(bytearr.readByte(), Values.INT8_MAX);
    assert.equal(bytearr.readByte(), Values.INT8_MAX - 1);

    assert.throws(() => bytearr.writeByte(Values.INT8_MIN - 1));
    assert.throws(() => bytearr.writeByte(Values.INT8_MAX + 1));
  });

  it('should support unsigned bytes', () => {
    const bytearr = new ByteArray();

    bytearr.writeUnsignedByte(Values.UINT8_MIN);
    bytearr.writeUnsignedByte(Values.UINT8_MAX);
    bytearr.writeUnsignedByte(Values.UINT8_MAX - 1);

    assert.equal(bytearr.position, 3);
    bytearr.position = 0;

    assert.equal(bytearr.readUnsignedByte(), Values.UINT8_MIN);
    assert.equal(bytearr.readUnsignedByte(), Values.UINT8_MAX);
    assert.equal(bytearr.readUnsignedByte(), Values.UINT8_MAX - 1);

    assert.throws(() => bytearr.writeUnsignedByte(Values.UINT8_MIN - 1));
    assert.throws(() => bytearr.writeUnsignedByte(Values.UINT8_MAX + 1));
  });
});