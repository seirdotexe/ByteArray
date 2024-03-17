import ByteArray from '../index.js';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('adobe test', () => {
  it('should pass the api example', () => {
    const bytearr = new ByteArray();

    bytearr.writeBoolean(false);

    assert.equal(bytearr.length, 1);
    assert.equal(bytearr.get(0), 0);

    bytearr.writeDouble(Math.PI);

    assert.equal(bytearr.length, 9);
    assert.equal(bytearr.get(0), 0);
    assert.equal(bytearr.get(0), 0);
    assert.equal(bytearr.get(1), 64);
    assert.equal(bytearr.get(2), 9);
    assert.equal(bytearr.get(3), 33);
    assert.equal(bytearr.get(4), 251);
    assert.equal(bytearr.get(5), 84);
    assert.equal(bytearr.get(6), 68);
    assert.equal(bytearr.get(7), 45);
    assert.equal(bytearr.get(8), 24);

    bytearr.position = 0;

    assert.ok(!bytearr.readBoolean());
    assert.equal(bytearr.readDouble(), Math.PI);
    assert.throws(() => bytearr.readDouble());
  });

  it('should pass the groceries example', () => {
    const bytearr = new ByteArray();
    const groceries = { milk: 4.5, soup: 1.79, eggs: 3.19, bread: 2.35 };
    const length = Object.keys(groceries).length;

    for (const [product, price] of Object.entries(groceries)) {
      bytearr.writeUTF(product);
      bytearr.writeDouble(price);
    }

    bytearr.position = 0;

    for (let i = 0; i < length; i++) {
      const [product, price] = [bytearr.readUTF(), bytearr.readDouble()];

      assert.equal(groceries[product], price);
    }
  });

  it('should pass the lorem ipsum example', () => {
    const bytearr = new ByteArray();
    const text = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Vivamus etc.';

    bytearr.writeUTFBytes(text);

    assert.equal(bytearr.length, text.length);

    bytearr.position = 0;

    while ((bytearr.bytesAvailable > 0) && (bytearr.readUTFBytes(1) !== 'a')) {
      // Read to the letter 'a' or to the end
    }

    if (bytearr.position < bytearr.bytesAvailable) {
      assert.equal(bytearr.position, 23);
      assert.equal(bytearr.bytesAvailable, 47);
    }
  });
});