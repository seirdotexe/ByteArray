import ByteArray from '../index.js';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('float test', () => {
  it('should support floats with no decimal', () => {
    const bytearr = new ByteArray();

    for (let i = 0; i < 100; i++) {
      const value = ~~(Math.random() * 1000);

      bytearr.writeFloat(value);
      bytearr.position = 0;
      assert.equal(bytearr.readFloat(), value);

      bytearr.clear();
    }
  });

  it('should support floats with 1 decimal', () => {
    const bytearr = new ByteArray();

    for (let i = 0; i < 100; i++) {
      const value = (Math.random() * 1000).toFixed(1);

      bytearr.writeFloat(value);
      bytearr.position = 0;
      assert.equal(bytearr.readFloat().toFixed(1), value);

      bytearr.clear();
    }
  });

  it('should support floats with 2 decimals', () => {
    const bytearr = new ByteArray();

    for (let i = 0; i < 100; i++) {
      const value = (Math.random() * 1000).toFixed(2);

      bytearr.writeFloat(value);
      bytearr.position = 0;
      assert.equal(bytearr.readFloat().toFixed(2), value);

      bytearr.clear();
    }
  });

  it('should support floats with 3 decimals', () => {
    const bytearr = new ByteArray();

    for (let i = 0; i < 100; i++) {
      const value = (Math.random() * 1000).toFixed(3);

      bytearr.writeFloat(value);
      bytearr.position = 0;
      assert.equal(bytearr.readFloat().toFixed(3), value);

      bytearr.clear();
    }
  });
});