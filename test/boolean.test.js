import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import ByteArray from '../index.js';

describe('boolean test', () => {
  it('should support using booleans', () => {
    const bytearr = new ByteArray();

    bytearr.writeBoolean(true);
    bytearr.writeBoolean(false);

    assert.equal(bytearr.position, 2);
    bytearr.position = 0;

    assert.ok(bytearr.readBoolean());
    assert.ok(!bytearr.readBoolean());
  });

  it('should support using numbers', () => {
    const bytearr = new ByteArray();

    bytearr.writeBoolean(1);
    bytearr.writeBoolean(0);

    assert.equal(bytearr.position, 2);
    bytearr.position = 0;

    assert.ok(bytearr.readBoolean());
    assert.ok(!bytearr.readBoolean());
  });
});