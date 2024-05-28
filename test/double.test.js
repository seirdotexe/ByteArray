import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import ByteArray from '../index.js';

describe('double test', () => {
  it('should support doubles with no decimal', () => {
    const bytearr = new ByteArray();

    for (let i = 0; i < 100; i++) {
      const value = ~~(Math.random() * 1000);

      bytearr.writeDouble(value);
      bytearr.position = 0;
      assert.equal(bytearr.readDouble(), value);

      bytearr.clear();
    }
  });

  it('should support doubles with 1 decimal', () => {
    const bytearr = new ByteArray();

    for (let i = 0; i < 100; i++) {
      const value = (Math.random() * 1000).toFixed(1);

      bytearr.writeDouble(value);
      bytearr.position = 0;
      assert.equal(bytearr.readDouble().toFixed(1), value);

      bytearr.clear();
    }
  });

  it('should support doubles with 2 decimals', () => {
    const bytearr = new ByteArray();

    for (let i = 0; i < 100; i++) {
      const value = (Math.random() * 1000).toFixed(2);

      bytearr.writeDouble(value);
      bytearr.position = 0;
      assert.equal(bytearr.readDouble().toFixed(2), value);

      bytearr.clear();
    }
  });

  it('should support doubles with 3 decimals', () => {
    const bytearr = new ByteArray();

    for (let i = 0; i < 100; i++) {
      const value = (Math.random() * 1000).toFixed(3);

      bytearr.writeDouble(value);
      bytearr.position = 0;
      assert.equal(bytearr.readDouble().toFixed(3), value);

      bytearr.clear();
    }
  });
});